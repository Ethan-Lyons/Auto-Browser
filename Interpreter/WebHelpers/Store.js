import { BrowserContext } from 'puppeteer-core';
import { canFind, findText, info, assertStep } from './WebHelpers.js';
import * as Variables from './StoreVariables.js';

/**
 * Parses a storeStep and performs a store action.
 * @param {BrowserContext} context The browser context
 *  instance to use.
 * @param {{name: "STORE", type: "Action", args: [Object, Object]}} storeStep An object
 * containing the information for the store action.
 * @throws {Error} If the store mode is not supported.
 */
export async function store(context, storeStep) {
    const storeSpec = parseStore(storeStep);
    await exeStore(context, storeSpec.mode, storeSpec.step, storeSpec.storeName);
}

/**
 * Obtains the store information from a store step.
 * @param {{name: "STORE", type: "Action", args: [Object, Object]}} storeStep The store step.
 * @returns {{ mode: string, step: Object, storeName: string }}
 */
export function parseStore(storeStep) {
    assertStep(storeStep, "STORE", "parseStore");

    const [storableStep, varNameStep] = storeStep.args;

    const storableSpec = parseStorable(storableStep);
    const varSpec = parseVar(varNameStep);

    return {
        mode: storableSpec.mode,
        step: storableSpec.step,
        storeName: varSpec.value
    };
}

/**
 * Stores the result of a store action under a new variable name.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {string} mode The store mode to use (case insensitive). Valid modes are: "TEXT", "FIND_TEXT", "CAN_FIND", "INFO".
 * @param {Object} step The step object for the selected store mode.
 * @param {string} storeName The new variable name to store under.
 * @throws {Error} If the store mode is not supported.
 * @returns {Promise<void>} A promise that resolves when the value has been stored under the new variable name.
 */
export async function exeStore(context, mode, step, storeName) {
    const upMode = mode.toUpperCase();
    let result = "";

    switch (upMode) {
        case "TEXT":
            //return storeText(step, storeName);
            result = Variables.resolveString(step.value);
            //Variables.set(storeName, result);
            break;
        case "FIND_TEXT":
            result = await findText(context, step);
            //Variables.set(storeName, result);
            break;
            //return await storeFindText(context, step, storeName);
        case "CAN_FIND":
            result = String(await canFind(context, step));
            //Variables.set(storeName, result);
            break;
            //return await storeCanFind(context, step, storeName);
        case "INFO":
            result = String(await info(context, step));
            //Variables.set(storeName, result);
            break;
            //return await storeInfo(context, step, storeName);
        default:
            throw new Error(`exeStore: unsupported store mode: ${mode}`);
    }

    Variables.setVariable(storeName, result);
}

/**
 * Obtains the store mode and step from a storable step.
 * @param {{name: "STORABLE", type: "ActionGroup", selected: Object}} storableStep 
 * @returns {{mode: string, step: Object}}
 */
export function parseStorable(storableStep) {
    assertStep(storableStep, "STORABLE", "parseStorable");

    const selected = storableStep.selected;
    return { mode: selected.name, step: selected };
}

/**
 * Obtains the variable name from a variable step.
 * @param {{ name: "VARIABLE", type: "Action", value: string}} varNameStep An object
 * containing the information for the variable name.
 * @returns {{ value: string }}
 */
export function parseVar(varNameStep) {
    assertStep(varNameStep, "VARIABLE", "parseVar");

    return { value: varNameStep.value };
}