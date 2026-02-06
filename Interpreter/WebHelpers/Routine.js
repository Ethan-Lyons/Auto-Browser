import fs from "fs";

/**
 * Class representing a routine. A routine is a stack containing a series of steps to perform.
 * Class is responsible for handling the stack and logging operations.
 * Can be loaded from a JSON file or created from scratch.
 */
export class Routine {
  constructor(routineJSON = null) {
    if (routineJSON) {  // If a JSON Object is provided
      this.steps = routineJSON.steps ?? [];
    } else {
      // If no JSON path is provided, create an empty routine
      this.steps = [];
    }

    this.filePath = null;
    this.stack = [...this.steps].reverse(); // Reverse for stack ordering
    
    // Create a log file
    this.stackLogPath = "stack.log";
    fs.writeFileSync(this.stackLogPath,
      "=== STACK TRACE START ===\n");

    this._logStack("INIT");
  }

  static fromFile(filePath) {
    try {
      // Load the routine from the file
      const fileContent = fs.readFileSync(filePath, "utf8");
      const routineJSON = JSON.parse(fileContent);

      // Create the routine
      const routine = new Routine(routineJSON);
      routine.filePath = filePath;
      return routine;

    } catch (error) {
      throw new Error(
        `Failed to load routine from file '${filePath}',
        \nDirectory: ${process.cwd()}:\n${error.message}`
      );
    }
  }

  /**
   * Returns true if there are more steps in the routine, false otherwise.
   * @returns {Boolean} Whether there are more steps in the routine.
   */
  hasNext() {
    return this.stack.length > 0;
  }

  /**
   * Removes the top step from the stack and returns it.
   * @returns {Object} The top step from the stack.
   */
  pop() {
    const step = this.stack.pop();
    this._logStack("POP", step?.selected?.name);
    return step;
  }

  /**
   * Pushes a step onto the stack.
   * @param {Object} step The step to push onto the stack.
   */
  push(step) {
    this._logStack("PUSH", step?.selected?.name);
    this.stack.push(step);
  }
  
  /**
   * Pushes multiple steps onto the stack. The steps are pushed assuming list ordering, i.e.
   * the first step in the array is pushed first, then the second, and so on.
   * @param {Object[]} newElements The steps to push onto the stack.
   */
  pushManyStack(newElements) {
    if (!newElements) {
      return;
    }
    for (let i = 0; i < newElements.length; i++) {
      this.stack.push(newElements[i]);
    }
    this._logStack("PUSH_MANY_STACK");
  }

  /**
   * Pushes multiple steps onto the stack. The steps are pushed assuming stack ordering, i.e.
   * the last step in the array is pushed first, then the second to last, and so on.
   * @param {Object[]} list The steps to push onto the stack.
   */
  pushManyList(list) {
    for (let i = list.length - 1; i >= 0; i--) {
      this.stack.push(list[i]);
    }
    this._logStack("PUSH_MANY_LIST");
  }

  /**
   * Pops a control block from the stack based on the given type.
   * Control blocks are defined as blocks of steps that are grouped together
   * to form a single logical unit. Examples of control blocks include FOR loops,
   * IF statements, and WHILE loops.
   * @param {String} type The type of control block to pop from the stack.
   * @returns {Object} The popped control block, or null if the stack is empty.
   * @throws {Error} If the given type is not supported.
   */
  popControlBlock(type) {
    type = type.toUpperCase();
    switch (type) {
      case "FOR": return this.popBlock("FOR", "END_FOR");
      case "IF": return this.popBlock("IF", "END_IF", "ELSE");
      case "WHILE": return this.popBlock("WHILE", "END_WHILE");
      default:
        throw new Error(`popControlBlock: unsupported control block type: ${type}`);
    }
  }
  
  /**
   * Pops a control block from the stack based on the given type.
   * The popped control block is returned as an object with three properties:
   * - body: the steps before the given split token
   * - bodyPost: the steps after the split token
   * - end: the end marker of the popped control block
   * @param {String} startToken The name of the step that starts the control block
   * @param {String} endToken The name of the step that ends the control block
   * @param {String} splitToken (optional) The name of the step that splits the control block into two parts
   * @returns {Object} The popped control block
   * @throws {Error} If the given type is not supported or if the popped control block is unmatched
   */
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
        if(!next) {
          throw new Error(`popBlock: missing selected step under step: ${nextAg}, name ${nextAg.name}`);
        }

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
    
    
    const returnBody = before.reverse();
    const returnPost = after.reverse();
    this._logStack("POP_BLOCK_END");
    return {
        body: returnBody,
        bodyPost: returnPost,
        end: endStep
    };
  }

/**
 * Returns the steps in the routine.
 * @returns {Object[]} An array of steps in the routine.
 */
  getSteps(){
    return this.steps;
  }

/**
 * Returns the stack of the routine, which is an array of steps
 * that are yet to be executed.
 * @returns {Object[]} An array of steps in the routine stack.
 */
  getStack(){
    return this.stack;
  }

/**
 * Logs a snapshot of the stack to a file.
 * @param {string} op The operation that triggered the log.
 * @param {string} [detail] Optional detail to append to the log.
 * 
 * The log will contain the given operation and detail, followed by a
 * snapshot of the current stack in the format of "TOP → <step> | <step> | ..."
 * where each step is represented by its name.
 */
  _logStack(op, detail = "") {
  const snapshot = this._formatStack();
  fs.appendFileSync(
    this.stackLogPath,
    `[${op}] ${detail}\n` +
    `TOP → ${snapshot.join(" | ")}\n\n`
  );
  }

/**
 * Formats the stack into a string representation.
 * The formatted string is a snapshot of the current stack in the format of
 * "TOP → <step> | <step> | ...", where each step is represented by its name.
 * If the step does not have a name, it is represented by "<unknown>".
 * @returns {string} A formatted string representation of the stack.
 */
  _formatStack() {
    return this.stack
      .slice()
      .reverse()
      .map(s => s.selected?.name ?? s.name ?? "<unknown>");
  }

/**
 * Returns the name of the routine.
 * @returns {string} The name of the routine, which is the path to the JSON file.
 */
  getName() {
    return this.filePath;
  }
}
