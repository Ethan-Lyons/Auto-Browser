import { canFind } from "./FindAlt.js";
import { resolveNumber, resolveBoolean } from "./StoreVariables.js";

/**
 * Repeats a block of actions n times, where n is the difference between
 * the end and start index of a FOR loop.
 * (Indexes can be resolved from string, variable, or number formats)
 * @param {Object} forStep - The 'FOR' loop step object. The step should have
 *  the name 'FOR', and two arguments, the start and end index. A matching
 *  'END_FOR' step is required to appear after.
 * @param {Object} routine - The routine object
 */
export function routineFor(forStep, routine) {
  let [start, end] = forStep.args;
  const forName = forStep.name

  start = resolveNumber(start.value)
  end = resolveNumber(end.value)  // Resolve values to valid number

  const loopCount = Math.max(end - start, 0);

  // Block contains:
  //  body: actions to execute
  //  bodyPost: empty
  //  end: end marker
  const block = routine.popControlBlock(forName);
  const body = block.body;

  for (let i = 0; i < loopCount; i++) { // Repeat block push n times
    routine.pushManyStack(body);
  }
}

export function routineWhile(whileStep, routine) {
  let [condition] = whileStep.args;
  const whileName = whileStep.name;

  condition = resolveBoolean(condition);  // Resolve value to boolean

  // Block contains:
  //  body: actions to execute
  //  bodyPost: empty
  //  end: end marker
  const block = routine.popControlBlock(whileName);

  if (condition){
    // Push actions to execute
    routine.pushManyStack(block.body);  

    // Duplicate original while structure to loop again
    routine.push(block.end);
    routine.pushManyStack(block);
    routine.push(whileStep)
  }
}

export function routineIf(ifStep, routine) {
  let [condition] = ifStep.args;
  const ifName = ifStep.name;

  // Resolve different arg types to boolean
  condition = ifArgHandler(condition);

  // Block contains:
  //  body: actions to execute if condition is true
  //  bodyPost: actions to execute if condition is false
  //  end: end marker
  const block = routine.popControlBlock(ifName);

  if (condition){ // Push items inside the if section
    routine.pushManyStack(block.body); 
  }
  else {  // Push items inside the else section
    routine.pushManyStack(block.bodyPost);
  }
}

function ifArgHandler(argStep) {
  argStep.name = argStep.name.toLowerCase();

  // handle 'if' arg types
  if (argStep.name === "text") return resolveBoolean(argStep.selected.value);
  else if (argStep.name === "can_find") return canFind(argStep);

  // If arg type is unknown
  else throw new Error(`Unknown if argument type: ${argStep.name}`);
}
