import { condition } from "./Condition.js";
import { assertStep } from "../Assert.js";
import { Routine } from "../Routine.js";
import { BrowserContext } from "puppeteer-core";

/**
 * Parses an ifStep and executes a routine if the condition is true.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{ name: "IF", type: "Action", args: [Object] }} ifStep An object
 * containing the information for the if action.
 * @param {Routine} routine The routine object.
 */
export async function routineIf(context, ifStep, routine) {
  ifSpec = parseIf(ifStep);
  conResult = await condition(context, ifSpec.condition)
  exeIf(routine, conResult, ifSpec.name);
}

/**
 * Obtains important values from a 'ifStep' input and returns them using an object
 * @param {{ name: "IF", type: "Action", args: [Object] }} ifStep 
 * @returns {{ name: String, condition: Object }}
 */
export function parseIf(ifStep) {
    assertStep(ifStep, "IF", "parseIf");

    let [conditionStep] = ifStep.args;

    const ifName = ifStep.name;
    return { name: ifName, condition: conditionStep }
}

/**
 * Pushes the items inside the if block to the routine stack if the condition
 * is true, or the items inside the else block if the condition is false.
 * @param {Routine} routine The routine object.
 * @param {Boolean} condition The result of the condition action.
 * @param {String} ifName The name of the IF step, used to identify the block.
 */
export function exeIf(routine, condition, ifName) {
  assert(condition == true || condition == false,
      "exeIf: input condition is not boolean");
      
  // Block contains:
  //  body: actions to execute if condition is true
  //  bodyPost: actions to execute if condition is false
  //  end: end marker
  const block = routine.popControlBlock(ifName);

  if (condition) { // Push items inside the if section
    routine.pushManyStack(block.body); 
  }
  else if (block.bodyPost) {  // Push items inside the else section
    routine.pushManyStack(block.bodyPost);
  }
}