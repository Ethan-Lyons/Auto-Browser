import { BrowserContext } from "puppeteer-core";
import { typeText, shortcut, assertStep } from "../WebHelpers.js";

export const KEYBOARD_NAME = "KEYBOARD";
export const TYPE_TEXT_NAME = "TYPE_TEXT";
export const SHORTCUT_NAME = "SHORTCUT";

/**
 * Parses and executes a keyboard action.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{name: "KEYBOARD", type: "Action", args: [Object]}} kbStep An object
 * containing the information for the keyboard action.
 * @returns {Promise<void>} A promise that resolves when the keyboard action is completed.
 */
export async function keyboard(context, kbStep) {
    const keySpec = parseKeyboard(kbStep)
    await exeKeyboard(context, keySpec.modeStep);
}

/**
 * Obtains the important values from a 'keyboardStep' input and returns them using an object.
 * @param {{name: "KEYBOARD", type: "Action", args: [Object]}} kbStep An object
 * containing the information for the keyboard action.
 * @returns {{ modeStep: Object }}
 */
export function parseKeyboard(kbStep) {
    assertStep(kbStep, KEYBOARD_NAME, "parseKeyboard");

    const [keyMode] = kbStep.args;
    return { modeStep: keyMode.selected };
}

/**
 * Executes a keyboard action based on the given keyboard mode.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {Object} subKeyStep The keyboard mode to use.
 * @returns {Promise<void>} A promise that resolves when the keyboard action is completed.
 */
export async function exeKeyboard(context, subKeyStep) {
    const upMode = subKeyStep.name.toUpperCase();
    switch (upMode) {
        case TYPE_TEXT_NAME:
            await typeText(context, subKeyStep);
            break;
        case SHORTCUT_NAME:
            await shortcut(context, subKeyStep);
            break;
        default:
            throw new Error(`exeKeyboard: unsupported keyboard mode: ${upMode}`);
    }
}