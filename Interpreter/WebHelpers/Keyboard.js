import { assertStep } from "./Assert";

/**
 * Parses and executes a keyboard action.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{name: "KEYBOARD", type: "Action", args: [Object]}} keyStep An object
 * containing the information for the keyboard action.
 * @returns {Promise<void>} A promise that resolves when the keyboard action is completed.
 */
export async function keyboard(context, keyStep) {
    const page = await getActivePage(context);
    const keySpec = parseKeyboard(keyStep)
    await exeKeyboard(keySpec.mode)
}

/**
 * Obtains the important values from a 'keyboardStep' input and returns them using an object.
 * @param {{name: "KEYBOARD", type: "Action", args: [Object]}} keyStep An object
 * containing the information for the keyboard action.
 * @returns {{ mode: String }}
 */
export async function parseKeyboard(keyStep) {
    assertStep(keyStep, "KEYBOARD", "parseKeyboard");

    [keyMode] = keyStep.args;
    return { mode: keyMode }
}

/**
 * Executes a keyboard action based on the given keyboard mode.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {String} keyMode The keyboard mode to use.
 * @returns {Promise<void>} A promise that resolves when the keyboard action is completed.
 */
export async function exeKeyboard(keyMode) {
    keyMode = keyMode.toUpperCase();
    switch (keyMode) {
        case "TYPE_TEXT":
            return await typeText(keyMode);
        case "SHORTCUT":
            return await shortcut(keyMode);
        default:
            throw new Error(`exeKeyboard: unsupported keyboard mode: ${keyMode}`);
    }
}