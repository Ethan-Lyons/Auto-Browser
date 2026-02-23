import { BrowserContext } from "puppeteer-core";
import { getActivePage, setFocus, assertStep } from "../WebHelpers";

/**
 * Parses a typeTextStep and executes the typeText action.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{name: "TYPE_TEXT", type: "Action", args: [Object]}} typeTextStep An object
 * containing the information for the typeText action.
 */
export async function typeText(context, typeTextStep) {
    const spec = parseTypeText(typeTextStep);

    await setFocus(context, spec.setFocusStep);
    await exeTypeText(context, spec.text, spec.delay);
}

/**
 * Obtains the important information from a typeTextStep and returns it as an object.
 * @param {{name: "TYPE_TEXT", type: "Action", args: [Object]}} typeTextStep An object
 * containing the information for the typeText action.
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
 * Types text into the currently focused element.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {string} text The text to type.
 * @param {Number} delay The delay, in milliseconds, between typing each character.
 */
export async function exeTypeText(context, text, delay) {
    const page = await getActivePage(context);

    // Ensure delay is non-negative
    let numDelay = Number(delay);
    numDelay = Math.max(0, numDelay || 0);

    await page.keyboard.type(text, { delay: numDelay });
}