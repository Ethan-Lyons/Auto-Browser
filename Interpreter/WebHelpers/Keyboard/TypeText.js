import { assertStep } from "../Assert";
import { getActivePage, find, setFocus } from "../WebHelpers";
import { BrowserContext, Locator } from "puppeteer-core";

/**
 * 
 * @param {BrowserContext} context 
 * @param {{name: "TYPE_TEXT", type: "Action", args: [Object]}} typeTextStep 
 */
export async function typeText(context, typeTextStep) {
    const spec = parseTypeText(typeTextStep);

    await setFocus(context, spec.setFocusStep);
    await exeTypeText(context, spec.text, spec.delay);
}

/**
 * 
 * @param {{name: "TYPE_TEXT", type: "Action", args: [Object]}} typeTextStep 
 * @returns {{ findStep: Object | null, text: string, delay: Number }}
 */
export function parseTypeText(typeTextStep) {
    assertStep(typeTextStep, "TYPE_TEXT", "parseTypeText");

    // Ensure argument structure is correct
    const [textStep, delayStep, setFocusStep] = typeTextStep.args;
    assertStep(textStep, "TEXT", "parseTypeText");
    assertStep(delayStep, "DELAY_MS", "parseTypeText");
    assertStep(setFocusStep, "SET_FOCUS", "parseTypeText");

    const text = textStep.value;
    const delay = delayStep.value;

    return { text: text.value, delay: delay.value, setFocusStep: setFocusStep };
}

/**
 * 
 * @param {Locator} locator 
 * @param {string} text 
 * @param {Number} delay 
 */
export async function exeTypeText(context, text, delay) {
    const page = await getActivePage(context);

    // Ensure delay is non-negative
    let numDelay = Number(delay);
    numDelay = Math.max(0, numDelay || 0);

    await page.keyboard.type(text, { delay: numDelay });
}