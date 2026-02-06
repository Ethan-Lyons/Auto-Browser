import { resolveNumber } from "../StoreVariables.js";
import { assertStep } from "../Assert.js";
import { Routine } from "../Routine.js";

/**
 * Repeats a block of actions n times, where n is the difference between
 * the end and start index of a FOR loop.
 * (Indexes can be resolved from string, variable, or number formats)
 * @param {{ name: "FOR", type: "Action", args: [Object, Object]}} forStep An object
 * containing the information for the for action.
 * @param {Routine} routine The routine object.
 */
export function routineFor(forStep, routine) {
  forSpec = parseFor(forStep)
  loopCount = forSpec.end - forSpec.start
  exeFor(routine, loopCount, forSpec.name)
}

/**
 * Obtains important values from a 'forStep' input and returns them using an object.
 * @param {{ name: "FOR", type: "Action", args: [Object, Object]}} forStep An object
 * containing the information for the for action.
 * @returns {{ name: String, start: Number, end: Number}}
 */
export function parseFor(forStep) {
  assertStep(forStep, "FOR", "parseFor");
  
  let [start, end] = forStep.args;
  const forName = forStep.name

  start = resolveNumber(start.value)
  end = resolveNumber(end.value)  // Resolve values to valid number

  return { name: forName, start: start, end: end }

}

/**
 * Push the body of a FOR loop block n times on the stack, where n is the difference between
 * the end and start index of a FOR loop.
 * @param {Routine} routine The routine object.
 * @param {Number} loopCount The number of times to repeat the block.
 * @param {String} forName The name of the FOR loop step, used to identify the block.
 */
export function exeFor(routine, loopCount, forName) {
    loopCount = Math.max(0, loopCount)

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