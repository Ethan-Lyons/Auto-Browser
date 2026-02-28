import { BrowserContext } from "puppeteer-core";
import { condition, Routine, assertStep } from "../WebHelpers.js";

export const WHILE_NAME = "WHILE";
export const END_WHILE_NAME = "END_WHILE";

/**
 * Parses a whileStep and repeatedly pushes a routine block while the condition
 * is true and discards it if it becomes false.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{name: "WHILE", type: "Action", args: [Object]}} whileStep An object
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
 * @param {{name: "WHILE", type: "Action", args: [Object]}} whileStep 
 * @returns {{name: string, condition: Object}}
 */
export function parseWhile(whileStep) {
    assertStep(whileStep, WHILE_NAME, "parseWhile");

    const [condition] = whileStep.args;
    const whileName = whileStep.name;

    return {
        name: whileName,
        condition: condition
    }
}

/**
 * Pushes the items inside the while block to the routine stack if the condition
 * is true, then pushes a duplication of the while block to loop again.
 * @param {Routine} routine The routine object.
 * @param {Boolean} condition The result of the condition action.
 * @param {{name: "WHILE", type: "Action", args: [Object]}} whileStep 
 */
export async function exeWhile(routine, condition, whileStep) {
    if (!(condition === true || condition === false)) {
        throw new Error(`Invalid condition recieved. Condition: ${condition}`)
    }

    // Block contains:
    //  body: actions to be executed
    //  bodyPost: empty in this case
    //  end: end while marker
    const block = routine.popControlBlock(whileStep.name);

    if (condition == true && block.body.length > 0) {
        // Push actions to executed
        routine.pushManyStack(block.body);  

        // Duplicate original while structure to loop again
        routine.push(block.end);
        routine.pushManyStack(block.body);
        routine.push(whileStep)
    }
}