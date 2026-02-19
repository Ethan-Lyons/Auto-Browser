import { assertStep } from "../Assert";
import { typeText, shortcut, setFocus } from "../WebHelpers.js";

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
    assertStep(kbStep, "KEYBOARD", "parseKeyboard");

    const [keyMode] = kbStep.args;
    return { modeStep: keyMode.selected };
}

/**
 * Executes a keyboard action based on the given keyboard mode.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {String} keyMode The keyboard mode to use.
 * @returns {Promise<void>} A promise that resolves when the keyboard action is completed.
 */
export async function exeKeyboard(context, keyModeStep) {
    const keyMode = keyModeStep.name.toUpperCase();
    switch (keyMode) {
        case "TYPE_TEXT":
            await typeText(context, keyModeStep);
            break;
        case "SHORTCUT":
            await shortcut(context, keyModeStep);
            break;
        default:
            throw new Error(`exeKeyboard: unsupported keyboard mode: ${keyMode}`);
    }
}