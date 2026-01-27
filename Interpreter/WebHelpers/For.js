import { resolveNumber } from "./StoreVariables.js";

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
  forSpec = parseFor(forStep)
  loopCount = forSpec.end - forSpec.start
  exeFor(routine, loopCount, forSpec.name)
}

export function parseFor(forStep) {
  if (!forStep || forStep.name?.toUpperCase() !== "FOR") {
    throw new Error(`parseFor: input is not a FOR action.
      Input: ${forStep}, Name: ${forStep.name}`);
  }
  
  let [start, end] = forStep.args;
  const forName = forStep.name

  start = resolveNumber(start.value)
  end = resolveNumber(end.value)  // Resolve values to valid number

  return { name: forName, start: start, end: end }

}

/**
 * Que the body of a FOR loop block n times, where n is the difference between
 * the end and start index of a FOR loop.
 * @param {Routine} routine - The routine object
 * @param {Number} loopCount - The number of times to repeat the block
 * @param {String} forName - The name of the FOR loop step (used for matching the end marker)
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