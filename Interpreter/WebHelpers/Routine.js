import fs from "fs";

export class Routine {
  constructor(routineJSON) {
    this.steps = routineJSON.steps;
    this.stack = [...this.steps].reverse();
    this.stackLogPath = "stack.log";
    fs.writeFileSync(this.stackLogPath, "=== STACK TRACE START ===\n");

    this._logStack("INIT");
  }

  static fromFile(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const routineJSON = JSON.parse(fileContent);
      return new Routine(routineJSON);
    } catch (error) {
      throw new Error(
        `Failed to load routine from file '${filePath}',\nDirectory: ${process.cwd()}:\n${error.message}`
      );
    }
  }

  hasNext() {
    return this.stack.length > 0;
  }

  pop() {
    const step = this.stack.pop();
    this._logStack("POP", step?.selected?.name);
    return step;
  }

  push(step) {
    this._logStack("PUSH", step?.selected?.name);
    this.stack.push(step);
  }

    // Pushes items onto the stack assuming input follows stack ordering
  pushManyStack(stack) {
    for (let i = 0; i < stack.length; i++) {
      this.stack.push(stack[i]);
    }
    this._logStack("PUSH_MANY_STACK");
  }

  // Pushes items onto the stack assuming input follows list ordering
  pushManyList(list) {
    for (let i = list.length - 1; i >= 0; i--) {
      this.stack.push(list[i]);
    }
    this._logStack("PUSH_MANY_LIST");
  }

  popControlBlock(type) {
    switch (type) {
      case "FOR": return this.popBlock("FOR", "END_FOR");
      case "IF": return this.popBlock("IF", "END_IF", "ELSE");
      case "WHILE": return this.popBlock("WHILE", "END_WHILE");
    }
  }

  // Returns a stack ordered sequence
  popBlock(startToken, endToken, splitToken = null) {
    this._logStack("POP_BLOCK_START", `\"${startToken} -> ${endToken}\"`);
    let depth = 1;

    const before = [];
    const after = [];

    let collectPost = false;
    let endStep = null;

    while (this.stack.length > 0) {
        const nextAg = this.stack.pop();
        const next = nextAg.selected;

        if (next.name === startToken) {
            depth++;
        }

        else if (next.name === endToken) {
            depth--;

            if (depth === 0) {
                endStep = next;
                break;
            }
        }

        else if (
            splitToken !== null &&
            next.name === splitToken &&
            depth === 1
        ) {
            this._logStack("POP_BLOCK_SPLIT", splitToken);
            collectPost = true;
            continue;
        }

        if (collectPost) {
            after.push(next);
        } else {
            before.push(next);
        }
    }

    if (depth !== 0) {
        throw new Error(
            `Unmatched ${startToken}/${endToken} block (depth: ${depth})`
        );
    }
    
    
    const returnBody = before.reverse()
    const returnPost = after.length > 0 ? after.reverse() : null
    // Return post body: [" + returnPost.map(a => a.name) + "]"
    this._logStack("POP_BLOCK_END");
    return {
        body: returnBody,
        bodyPost: returnPost,
        end: endStep
    };
}

  getSteps(){
    return this.steps
  }

  getStack(){
    return this.stack
  }

  _logStack(op, detail = "") {
  const snapshot = this._formatStack();
  fs.appendFileSync(
    this.stackLogPath,
    `[${op}] ${detail}\n` +
    `TOP → ${snapshot.join(" | ")}\n\n`
  );
  }

  _formatStack() {
    return this.stack
      .slice()
      .reverse()
      .map(s => s.selected?.name ?? s.name ?? "<unknown>");
  }

}
