import { assertStep } from "../Assert";
import { getActivePage, find } from "../WebHelpers";
import { BrowserContext, Locator } from "puppeteer-core";

/**
 * 
 * @param {BrowserContext} context 
 * @param {*} setFocusStep 
 * @returns 
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
 * 
 * @param {*} sfStep 
 * @returns 
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
 * 
 * @param {Locator} locator 
 */
export async function exeSetFocus(locator) {
    const element = await locator.waitHandle();
    await element.focus();
}