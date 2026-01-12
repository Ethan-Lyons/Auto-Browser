import fs from "fs";

export class Routine {
  constructor(routineJSON) {
    this.steps = routineJSON.steps;
    this.stack = [...this.steps].reverse();
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
    return this.stack.pop();
  }

  push(step) {
    this.stack.push(step);
  }

  pushMany(steps) {
    for (let i = steps.length - 1; i >= 0; i--) {
      this.stack.push(steps[i]);
    }
  }

  popControlBlock(type) {
  switch (type) {
    case "FOR": return this.popBlock("FOR", "END_FOR");
    case "IF": return this.popBlock("IF", "END_IF");
    case "WHILE": return this.popBlock("WHILE", "END_WHILE");
  }
}

  popBlock(startToken, endToken) {
  const collected = [];
  let depth = 1;

  while (this.stack.length > 0) {
    const nextAg = this.stack.pop();
    const next = nextAg.selected

    if (next.name == startToken) {
      depth++;
    } else if (next.name == endToken) {
      depth--;
      if (depth == 0) {
        break;
      }
    }

    collected.push(next);
  }

  if (depth !== 0) {
    throw new Error(`Unmatched ${startToken}/${endToken} block (depth: ${depth})`);
  }

  return collected.reverse();
  }


  getSteps(){
    return this.steps
  }

  getStack(){
    return this.stack
  }
}
