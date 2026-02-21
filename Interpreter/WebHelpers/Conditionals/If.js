import { BrowserContext } from "puppeteer-core";
import { condition, Routine, assertStep } from "../WebHelpers.js";

/**
 * Parses an ifStep and pushes a routine block if the condition is true or discards it if false.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{name: "IF", type: "Action", args: [Object]}} ifStep An object
 * containing the information for the if action.
 * @param {Routine} routine The routine object.
 */
export async function routineIf(context, ifStep, routine) {
  const ifSpec = parseIf(ifStep);
  const conResult = await condition(context, ifSpec.condition)
  exeIf(routine, conResult, ifSpec.name);
}

/**
 * Obtains important values from a 'ifStep' input and returns them using an object
 * @param {{name: "IF", type: "Action", args: [Object]}} ifStep 
 * @returns {{name: string, condition: Object}}
 */
export function parseIf(ifStep) {
    assertStep(ifStep, "IF", "parseIf");

    const [conditionStep] = ifStep.args;
    const ifName = ifStep.name;

    return {
      name: ifName,
      condition: conditionStep
    };
}

/**
 * Pushes the items inside the if block to the routine stack if the condition
 * is true, or the items inside the else block if the condition is false.
 * @param {Routine} routine The routine object.
 * @param {Boolean} condition The result of the condition action.
 * @param {string} ifName The name of the IF step, used to identify the block.
 */
export function exeIf(routine, condition, ifName) {
    if (!(condition === true || condition === false)) {
        throw new Error(`Invalid condition recieved. Condition: ${condition}`)
    }

  // Block contains:
  //  body: actions to executed if condition is true (if block)
  //  bodyPost: actions to executed if condition is false (else block)
  //  end: end if marker
  const block = routine.popControlBlock(ifName);

  if (condition) { // Push items inside the if section
    routine.pushManyStack(block.body); 
  }
  else if (block.bodyPost) {  // Push items inside the else section
    routine.pushManyStack(block.bodyPost);
  }
}