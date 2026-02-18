import { assertStep } from "./Assert";
import { getActivePage, find } from "./WebHelpers";
import { BrowserContext, Locator } from "puppeteer-core";

/**
 * 
 * @param {BrowserContext} context 
 * @param {{name: "TYPE_TEXT", type: "Action", args: [Object]}} typeTextStep 
 */
export async function typeText(context, typeTextStep) {
    const typeTextSpec = parseTypeText(typeTextStep);

    const locator = await find(context, typeTextSpec.findStep);
    await exeTypeText(locator, typeTextSpec.text, typeTextSpec.delay);
}

/**
 * 
 * @param {{name: "TYPE_TEXT", type: "Action", args: [Object]}} typeTextStep 
 * @returns {{ findStep: Object, text: string, delay: Number }}
 */
export function parseTypeText(typeTextStep) {
    assertStep(typeTextStep, "TYPE_TEXT", "parseTypeText");

    // Ensure argument structure is correct
    const [findStep, text, milliseconds] = typeTextStep.args;
    if (!findStep) throw new Error("Missing findStep argument in typeTextStep");
    if (!text) throw new Error("Missing text argument in typeTextStep");
    if (!milliseconds) throw new Error("Missing milliseconds argument in typeTextStep");

    assertStep(text, "TEXT", "parseTypeText");
    assertStep(milliseconds, "MILLISECONDS", "parseTypeText");

    return { findStep: findStep, text: text.value, delay: milliseconds.value};
}

/**
 * 
 * @param {Locator} locator 
 * @param {string} text 
 * @param {Number} delay 
 */
export async function exeTypeText(locator, text, delay) {
    // Fix negative or empty delay inputs
    numDelay = Number(delay);
    numDelay = Math.max(0, numDelay || 0);
    const element = await locator.waitHandle();
    await element.type(text, { delay: numDelay });
}