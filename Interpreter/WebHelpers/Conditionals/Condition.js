import { BrowserContext } from "puppeteer-core";
import { resolveBoolean, assertStep, canFind } from "../WebHelpers.js";

/**
 * Parses a conditionStep and returns the result of the condition action.
 * @param {BrowserContext} context 
 * @param {{name: "CONDITION", type: "ActionGroup", selected: Object}} conditionStep An object
 * containing the condition action data.
 * @returns {Promise<Boolean>} A promise that resolves with the result of the condition.
 */
export async function condition(context, conditionStep) {
    const conditionSpec = parseCondition(conditionStep);
    const result = await exeCondition(context, conditionSpec.mode,
        conditionSpec.step);
    return result;
}

/**
 * Obtains important values from a 'conditionStep' input and returns them using an object
 * @param {{name: "CONDITION", type: "ActionGroup", selected: Object}} conditionStep An object
 * containing the condition action data.
 * @returns {{ mode: string, step: Object }}
 */
export function parseCondition(conditionStep) {
    assertStep(conditionStep, "CONDITION", "parseCondition");

    // check for a selected mode
    const modeStep = conditionStep.selected
    if (!modeStep) {
        throw new Error(`parseCondition: missing selected mode`);
    }

    // check for a mode name
    const modeName = modeStep.name
    if (!modeName) {
        throw new Error(`parseCondition: missing mode name`);
    }
    
    return {
        mode: modeName,
        step: modeStep
    };     
}

/**
 * Performs a condition action based on the given condition mode and substep.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {string} mode The condition mode to use (case insensitive).
 * @param {Object} modeStep The step object for the selected condition mode.
 * @returns {Promise<Boolean>} A promise that resolves with the result of the condition action.
 */
export async function exeCondition(context, mode, modeStep) {
    mode = mode.toUpperCase();
    
    switch (mode) {
        case "TEXT":
            const value = modeStep.value;
            return resolveBoolean(value);

        case "CAN_FIND":
            return (await canFind(context, modeStep));
                
        default:
            throw new Error(`exeCondition: unsupported condition mode: ${mode}`);
    }
}

