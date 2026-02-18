import { assertStep } from "../Assert";
import { getActivePage, find, wait, resolveBoolean } from "../WebHelpers";
import { Browser, BrowserContext} from "puppeteer-core";
import { KEY_INPUT } from "./KeyInput";


/**
 * 
 * @param {{name: "SHORTCUT", type: "Action", args: [Object, Object, Object]}} scStep 
 */
export async function shortcut(context, scStep) {
    const shortcutSpec = parseShortcut(scStep);
    const keyList = keyStrListMerge(shortcutSpec.modKeyStr, shortcutSpec.mainKey)

    const waitNavBool = resolveBoolean(shortcutSpec.waitForNav);

    await exeShortcut(context, keyList, waitNavBool);
}

/**
 * 
 * @param {{name: "SHORTCUT", type: "Action", args: [Object, Object, Object]}} scStep 
 * @returns 
 */
export function parseShortcut(scStep) {
    assertStep(scStep, "SHORTCUT", "parseShortcut");

    // Ensure argument structure is correct
    const [modKeyStr, mainKey, waitNavStep] = scStep.args;
    assertStep(modKeyStr, "MOD_KEYS", "parseShortcut");
    assertStep(mainKey, "KEY", "parseShortcut");
    assertStep(waitNavStep, "WAIT_FOR_NAV", "parseShortcut");

    return { modKeyStr: modKeyStr.value, mainKey: mainKey.value, waitForNav: waitNavStep.selected.name };
}

/**
 * 
 * @param {string} keyStr 
 * @param {string} mainKey 
 * @returns 
 */
export function keyStrListMerge(keyStr, mainKey) {
    let keyStrList = [];

    // If there are no keys, do nothing, else split list by spaces and/or plus signs
    if (keyStr !== "") {
        keyStrList = keyStr.split(/[\s+]/);
    }
    // If there is a main key, add it
    if (mainKey !== "") {
        keyStrList.push(mainKey);
    }

    return keyStrList
}

/**
 * 
 * @param {BrowserContext} context 
 * @param {string[]} keyList 
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
 * 
 * @param {string} checkKey 
 * @returns 
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