import { BrowserContext } from 'puppeteer-core';

import { canFind, findText, info, assertStep, TEXT_NAME,
    FIND_TEXT_NAME, CAN_FIND_NAME, INFO_NAME } from '../WebHelpers.js';
    
import * as Variables from './StoreVariables.js';

export const STORE_NAME = "STORE";
export const STOREABLE_NAME = "STORABLE";
export const VARIABLE_NAME = "VARIABLE";

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
    assertStep(storeStep, STORE_NAME, "parseStore");

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
        case TEXT_NAME:
            result = Variables.resolveString(step.value);
            break;
        case FIND_TEXT_NAME:
            result = await findText(context, step);
            break;
        case CAN_FIND_NAME:
            result = String(await canFind(context, step));
            break;
        case INFO_NAME:
            result = String(await info(context, step));
            break;
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
    assertStep(storableStep, STOREABLE_NAME, "parseStorable");

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
    assertStep(varNameStep, VARIABLE_NAME, "parseVar");

    return { value: varNameStep.value };
}