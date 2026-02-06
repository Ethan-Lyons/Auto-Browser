import { canFind, findText, info } from './WebHelpers.js';
import { assertStep } from './Assert.js';
import * as Variables from './StoreVariables.js';
import { BrowserContext } from 'puppeteer-core';

/**
 * Parses a storeStep and performs a store action.
 * @param {BrowserContext} context The browser context
 *  instance to use.
 * @param {{ name: "STORE", type: "Action", args: [Object, Object] }} storeAction An object
 * containing the information for the store action.
 * @throws {Error} If the store mode is not supported.
 */
export async function store(context, storeStep) {
    const storeSpec = parseStore(storeStep);
    await exeStore(context, storeSpec.mode, storeSpec.step, storeSpec.storeName);
}

/**
 * Obtains the store information from a store step.
 * @param {{ name: "STORE", type: "Action", args: [Object, Object] }} storeStep The store step.
 * @returns {{ mode: String, step: Object, storeName: String }}
 */
export function parseStore(storeStep) {
    assertStep(storeStep, "STORE", "parseStore");

    const [storableStep, varNameStep] = storeStep.args;

    const storableSpec = parseStorable(storableStep);
    const varSpec = parseVar(varNameStep);

    return { mode: storableSpec.mode, step: storableSpec.step, storeName: varSpec.value };
}

/**
 * Stores the result of a store action under a new variable name.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {String} mode The store mode to use.
 * @param {Object} step The step object for the selected store mode.
 * @param {String} storeName The new variable name to store under.
 * @throws {Error} If the store mode is not supported.
 * @returns {Promise<void>} A promise that resolves when the value has been stored under the new variable name.
 */
export async function exeStore(context, mode, step, storeName) {
    mode = mode.toUpperCase();
    switch (mode) {
        case "TEXT":
            return storeText(step, storeName);
        case "FIND_TEXT":
            return await storeFindText(context, step, storeName);
        case "CAN_FIND":
            return await storeCanFind(context, step, storeName);
        case "INFO":
            return await storeInfo(context, step, storeName);
        default:
            throw new Error(`exeStore: unsupported store mode: ${mode}`);
    }
}

/**
 * Obtains the store mode and step from a storable step.
 * @param {{ name: "STORABLE", type: "ActionGroup", selected: Object }} storableStep 
 * @returns {{ mode: String, step: Object }}
 */
export function parseStorable(storableStep) {
    assertStep(storableStep, "STORABLE", "parseStorable");

    const selected = storableStep.selected;
    return { mode: selected.name, step: selected };
}

/**
 * Obtains the variable name from a variable step.
 * @param {{ name: "VARIABLE", type: "Action", value: String}} varNameStep An object
 * containing the information for the variable name.
 * @returns {{ value: String }}
 */
export function parseVar(varNameStep) {
    assertStep(varNameStep, "VARIABLE", "parseVar");

    return { value: varNameStep.value };
}

/**
 * Stores the result of a findText action under a new variable name.
 * @param {BrowserContext} context 
 * @param {{ name: "FIND_TEXT", type: "Action", args: [Object]}} findTextStep An object
 * containing the information for the findText action.
 * @param {String} varStoreName 
 * @returns {Promise<void>} A promise that resolves when the value
 *  has been stored under the new variable name.
 */
export async function storeFindText (context, findTextStep, varStoreName){
    const textReturn = await findText(context, findTextStep)
    Variables.setVariable(varStoreName, textReturn);
}

/**
 * Stores the result of an info action under a new variable name.
 * @param {BrowserContext} context The browser context
 *  instance to use.
 * @param {{ name: "INFO", type: "Action", args: [Object] }} infoStep An object
 * containing the information for the info action.
 * @param {String} varStoreName - The new variable name to store under.
 * @returns {Promise<void>} - A promise that resolves when the value
 *  has been stored under the new variable name.
 */
export async function storeInfo (context, infoStep, varStoreName){
    const infoReturn = await info(context, infoStep)
    Variables.setVariable(varStoreName, infoReturn);
}

/**
 * Stores a user input text value under a (new) variable name.
 * @param {{ name: "TEXT", type: "Argument", value: String }} textStep A step object
 *  with the text value to store.
 * @param {String} varStoreName - The new variable name to store under.
 */
export function storeText(textStep, varStoreName){
    assertStep(textStep, "TEXT", "storeText");
    const newVal = textStep.value;
    Variables.setVariable(varStoreName, newVal);
}

/**
 * Stores the result of a canFind action under a new variable name.
 * @param {BrowserContext} context The browser context
 *  instance to use.
 * @param {{ name: "CAN_FIND", type: "Action", args: [Object]}} findTextStep An object
 * containing the information for the canFind action.
 * @param {String} varStoreName - The new variable name to store under.
 * @returns {Promise<void>} - A promise that resolves when the value
 *  has been stored under the new variable name.
 */
export async function storeCanFind(context, findTextStep, varStoreName) {
    const result = await canFind(context, findTextStep);
    Variables.setVariable(varStoreName, result);
}