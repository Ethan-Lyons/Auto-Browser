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

  popUntil(predicate) {
    const collected = [];
    while (this.stack.length > 0) {
      const step = this.stack.pop();
      if (predicate(step)) break;
      collected.push(step);
    }
    return collected;
  }

  getSteps(){
    return this.steps
  }

  getStack(){
    return this.stack
  }
}
