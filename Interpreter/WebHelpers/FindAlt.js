import { assert } from "puppeteer-core";
import { find, getActivePage, assertStep } from "./WebHelpers.js"
import { TimeoutError, BrowserContext } from "puppeteer-core";

/**
 *  Parses a canFindStep and returns a bool indicating if the target element is found.
 *  @param {BrowserContext} context The browser context
 *  instance to use.
 *  @param {{name: "CAN_FIND", type: "Action", args: [Object]}} canFindStep An object
 *  containing the information for the canFind action.
 *  @returns {Promise<Boolean>} A promise that resolves with
 *  the Boolean result of finding the element.
 */
export async function canFind(context, canFindStep) {
    const findSpec = parseCanFind(canFindStep);
    const result = await exeCanFind(context, findSpec.findStep);
    return result;
}

/**
 * Obtains important values from a 'canFindStep' input and returns them using an object.
 * @param {{name: "CAN_FIND", type: "Action", args: [Object]}} canFindStep 
 * @returns {{ findStep: Object }}
 */
export function parseCanFind(canFindStep) {
    assertStep(canFindStep, 'CAN_FIND', 'parseCanFind');

    const [findStep] = canFindStep.args;
    return { findStep: findStep }
}

/**
 * Performs a find action and returns a bool indicating if the target element is found.
 * @param { BrowserContext } context The browser context instance to use.
 * @param {{name: "FIND", type: "ActionGroup", selected: Object}} findStep An object
 * containing the information for the find action.
 * @returns {Promise<Boolean>}
 */
export async function exeCanFind(context, findStep) {
    try {
        const locator = await find(context, findStep);
        await locator.waitHandle();
    } catch (err) {
        if (err instanceof TimeoutError) {
            return false;
        }
        throw err;
    }
    return true;
}

/**
 * Parses a findTextStep and returns all text in the found element.
 * @param {BrowserContext} context The browser context
 *  instance to use.
 * @param {{name: "FIND_TEXT", type: "Action", args: [Object]}} findTextStep An object
 *  containing the information for the findText action.
 * @returns {Promise<string>} A promise that resolves with
 *  the element's text content
 */
export async function findText(context, findTextStep) {
    const findSpec = parseFindText(findTextStep);
    return await exeFindText(context, findSpec.findStep);
}

/**
 * Obtains important values from a 'findTextStep' input and returns them using an object
 * @param {{name: "FIND_TEXT", type: "Action", args: [Object]}} findTextStep An object
 * containing the information for the findText action.
 * @returns {{ findStep: Object }}
 */
export function parseFindText(findTextStep) {
    assertStep(findTextStep, 'FIND_TEXT', 'parseFindText');

    const [findStep] = findTextStep.args;
    return { findStep: findStep }
}

/**
 * Performs a find action and returns the text content of the found element.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{name: "FIND_TEXT", type: "Action", args: [Object]}} findStep 
 * @returns {Promise<string>} A promise that resolves with the text content of the found element
 */
export async function exeFindText(context, findStep) {
    let elementHandle;
    const page = await getActivePage(context);
    const locator = await find(context, findStep);

    try {
        elementHandle = await locator.waitHandle();
    } catch (err) {
        if (err instanceof TimeoutError) {
            console.warn("Warning (findText): No element found.");
            return "";
        }
        throw err;
    }
    const text = await page.evaluate(el => el.textContent, elementHandle);

    return text;
}