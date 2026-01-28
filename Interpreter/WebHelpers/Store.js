import { findText, info } from './WebHelpers.js';
import { assertStep } from './Assert.js';
import * as Variables from './StoreVariables.js';

/**
 * Stores the result of an action under a new variable name.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @param {Object} storeAction A step object with two arguments,
 *  storableType: A step object with a single argument,
 *      the type of value to store.
 *   endVar: A step object with a single argument,
 *      the new variable name to store under.
 * @throws {Error} Error: Unknown store type if the type of
 *  storableType is unknown.
 */
export async function store(context, storeStep) {
    const storeSpec = parseStore(storeStep);
    await exeStore(context, storeSpec.mode, storeSpec.step, storeSpec.storeName);
}

export function parseStore(storeStep) {
    assertStep(storeStep, "STORE", "parseStore");

    const [storableStep, varStep] = storeStep.args;

    const storableSpec = parseStorable(storableStep);

    const varSpec = parseVar(varStep);

    return { mode: storableSpec.mode, step: storableSpec.step,
        storeName: varSpec.value };
}

export async function exeStore(context, mode, step, storeName) {
    mode = mode.toUpperCase();
    switch (mode) {
        case "TEXT":
            return storeText(step, storeName);
        case "FIND_TEXT":
            return await storeFindText(context, step, storeName);
        case "INFO":
            return await storeInfo(context, step, storeName);
        default:
            throw new Error(`exeStore: unsupported store mode: ${mode}`);
    }
}

function parseStorable(storableStep) {
    assertStep(storableStep, "STORABLE", "parseStorable");

    const selected = storableStep.selected;
    return { mode: selected.name, step: selected };
}

function parseVar(varStep) {
    assertStep(varStep, "VARIABLE", "parseVar");

    return { value: varStep.value };
}

async function storeFindText (context, findTextStep, varStoreName){
    const textReturn = await findText(context, findTextStep)
    Variables.setVariable(varStoreName, textReturn);
}

/**
 * Stores the result of an info action under a new variable name.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @param {Object} infoStep A step object with a single argument,
 *  the info action to store from.
 * @param {String} varStoreName - The new variable name to store under.
 * @returns {Promise<void>} - A promise that resolves when the value
 *  has been stored under the new variable name.
 */
async function storeInfo (context, infoStep, varStoreName){
    const infoReturn = await info(context, infoStep)
    Variables.setVariable(varStoreName, infoReturn);
}

/**
 * Stores a user input text value under a (new) variable name.
 * @param {Object} textStep - A step object with a single argument,
 *  the text value to store from.
 * @param {String} varStoreName - The new variable name to store under.
 */
function storeText(textStep, varStoreName){
    assertStep(textStep, "TEXT", "storeText");
    const newVal = textStep.value;
    Variables.setVariable(varStoreName, newVal);
}