import { condition } from "./Condition.js";
import { assertStep } from "../Assert.js";
import { assert, BrowserContext } from "puppeteer-core";
import { Routine } from "../Routine.js";

/**
 * 
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{ name: "WHILE", type: "Action", args: [Object] }} whileStep An object
 * containing the information for the while action.
 * @param {Routine} routine The routine object.
 */
export async function routineWhile(context, whileStep, routine) {
    const whileSpec = parseWhile(whileStep);
    const conResult = await condition(context, whileSpec.condition)
    exeWhile(routine, conResult, whileStep)
}

/**
 * Obtains important values from a 'whileStep' input and returns them using an object
 * @param {{ name: "WHILE", type: "Action", args: [Object] }} whileStep 
 * @returns {{ name: string, condition: Object }}
 */
export function parseWhile(whileStep) {
    assertStep(whileStep, "WHILE", "parseWhile");

    const [condition] = whileStep.args;
    const whileName = whileStep.name;

    return { name: whileName, condition: condition }
}

/**
 * Pushes the items inside the while block to the routine stack if the condition
 * is true, then pushes a duplication of the while block to loop again.
 * @param {Routine} routine The routine object.
 * @param {Boolean} condition The result of the condition action.
 * @param {{ name: "WHILE", type: "Action", args: [Object] }} whileStep 
 */
export async function exeWhile(routine, condition, whileStep) {
    assert(condition == true || condition == false,
        "exeWhile: input condition is not boolean");

    // Block contains:
    //  body: actions to execute
    //  bodyPost: empty
    //  end: end marker
    const block = routine.popControlBlock(whileStep.name);
    if (condition == true && block.body.length > 0) {
        // Push actions to execute
        routine.pushManyStack(block.body);  

        // Duplicate original while structure to loop again
        routine.push(block.end);
        routine.pushManyStack(block.body);
        routine.push(whileStep)
    }
}