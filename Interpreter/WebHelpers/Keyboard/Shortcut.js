import { BrowserContext} from "puppeteer-core";

import { getActivePage, setFocus, resolveBoolean, assertStep,
    SHORTCUT_NAME, SET_FOCUS_NAME, WAIT_FOR_NAV_NAME } from "../WebHelpers.js";
import { KEY_INPUT } from "./KeyInput.js";

export const KEYS_NAME = "KEYS";

/**
 * Parses a shortcutStep and performs a shortcut action.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{name: "SHORTCUT", type: "Action", args: [Object, Object, Object]}} scStep An object
 * containing the information for the shortcut action.
 * @returns {Promise<void>}
 */
export async function shortcut(context, scStep) {
    const shortcutSpec = parseShortcut(scStep);
    const keyList = keyStrToList(shortcutSpec.keysStr)

    const waitNavBool = resolveBoolean(shortcutSpec.waitForNav);

    await setFocus(context, shortcutSpec.setFocusStep);

    await exeShortcut(context, keyList, waitNavBool);
}

/**
 * Obtains the information from a 'shortcutStep' input and returns them using an object.
 * @param {{name: "SHORTCUT", type: "Action", args: [Object, Object, Object]}} scStep An object
 * containing the information for the shortcut action.
 * @returns {{ keysStr: string, waitForNav: string, setFocusStep: Object }}
 */
export function parseShortcut(scStep) {
    assertStep(scStep, SHORTCUT_NAME, "parseShortcut");

    // Ensure argument structure is correct
    const [keyStr, waitNavStep, setFocusStep] = scStep.args;
    assertStep(keyStr, KEYS_NAME, "parseShortcut");
    assertStep(waitNavStep, WAIT_FOR_NAV_NAME, "parseShortcut");
    assertStep(setFocusStep, SET_FOCUS_NAME, "parseShortcut");

    return { keysStr: keyStr.value,
        waitForNav: waitNavStep.selected.name,
        setFocusStep: setFocusStep };
}

/**
 * Turns a string of keys and a main key into a list of keys.
 * @param {string} keyStr A string containing a key or a list of keys separated by
 * spaces or plus signs.
 * @returns {string[]}
 */
export function keyStrToList(keyStr="") {
    let keyStrList = [];
    if (keyStr == "") {
        console.warn("Warning (keyStrToList): No keys in shortcut.");
        return [];
    }

    // If there are no keys, do nothing, else split list by spaces and/or plus signs
    if (keyStr !== "") {
        keyStrList = keyStr.split(/[\s+]/);
    }

    return keyStrList
}

/**
 * Executes a shortcut by pressing a list of keys and releasing them.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {string[]} keyList A list of keys to press.
 * @param {boolean} [waitForNav=false]
 */
export async function exeShortcut(context, keyList, waitForNav = false) {
    // If there are no keys, do nothing
    if (keyList.length === 0) {
        console.warn("Warning (exeShortcut): No keys in shortcut.");
        return;
    }
    // Format and check keys
    const newList = keyList.map(key => formatKey(key));

    const page = await getActivePage(context);

    const lastKey = newList.pop();

    try {
        // Press down all keys
        for (const key of newList) {
            await page.keyboard.down(key);
        }

        if (waitForNav) {
            await Promise.all([
                page.waitForNavigation({ waitUntil: "networkidle0" }),
                page.keyboard.press(lastKey)
            ]);

        } else {
            await page.keyboard.press(lastKey);
        }

    } finally {
        for (const key of newList.reverse()) {
            await page.keyboard.up(key);
        }
    }
}

/**
 * Changes the case of a key to match puppeteer style. Single letter keys maintain their
 * original case.
 * @param {string} checkKey The string for a single key to check.
 * @returns {import("puppeteer-core").KeyInput}
 * @throws {Error} If the key is found under the KEY_INPUT list.
 */
function formatKey(checkKey){
    for (const key of KEY_INPUT){
        // Maintains input case sensitivity for single character keys
        if (key.length === 1 && key === checkKey) {
            return key;
        }
        // Changes case of multi-character keys to match puppeteer style
        else if (key.toUpperCase() === checkKey.toUpperCase()) {
            return key;
        }
    }
    throw new Error(`validateKey: invalid key: ${checkKey}`);
}