import { BrowserContext, ElementHandle, Locator } from "puppeteer-core";
import { find, assertStep } from "../WebHelpers.js";

/**
 * Parses a setFocusStep and executes the setFocus action.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{name: "SET_FOCUS", type: "ActionGroup", selected: Object}} setFocusStep An object
 * containing the information for the setFocus action. 
 * @returns {Promise<void>} A promise that resolves when the setFocus action is completed.
 */
export async function setFocus(context, setFocusStep) {
    const sfSpec = parseSetFocus(setFocusStep);

    if (sfSpec == null || sfSpec.findStep == null) {
        return;
    }
    else {
        const locator = await find(context, sfSpec.findStep);
        await exeSetFocus(locator);
        return;
    }
}

/**
 * Obtains important values from a 'setFocusStep' input and returns them using an object.
 * @param {{name: "SET_FOCUS", type: "ActionGroup", selected: Object}} sfStep An object
 * containing the information for the setFocus action.
 * @returns {{findStep: Object}|null}
 * @throws {Error} If the step mode is not supported.
 */
export function parseSetFocus(sfStep) {
    assertStep(sfStep, "SET_FOCUS", "parseSetFocus");

    const subFocus = sfStep.selected;
    const mode = subFocus.name.toUpperCase();

    if (mode == "SKIP") {
        return null;
    }
    else if (mode == "FIND") {
        return {findStep: subFocus};
    }
    else {
        throw new Error("Unsupported focus step: " + subFocus.name);
    }
}

/**
 * Sets focus on the page element specified by the given locator.
 * @param {Locator} locator The locator of the element to set focus on.
 * @returns {Promise<void>} A promise that resolves when the focus is set.
 */
export async function exeSetFocus(locator) {
    const element = await locator.waitHandle();
    if (element instanceof ElementHandle){
        await element.focus();
    }
    else {
        throw new Error("Unable to set focus on element: " + locator);
    }
}