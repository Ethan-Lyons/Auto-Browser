import { assertStep } from "./Assert";
import { getActivePage, find } from "./WebHelpers";

export async function shortcut(scStep) {
    const shortcutSpec = parseShortcut(scStep);
    const keyList = keyStrListMerge(shortcutSpec.modKeyStr, shortcutSpec.mainKey)
    await exeShortcut(keyList)
}

export function parseShortcut(scStep) {
    assertStep(scStep, "SHORTCUT", "parseShortcut");

    const [modKeyStr, mainKey] = scStep.args;
    assertStep(modKeyStr, "MOD_KEYS", "parseShortcut");
    assertStep(mainKey, "KEY", "parseShortcut");

    return { modKeyStr: modKeyStr, mainKey: mainKey };
}

export function keyStrListMerge(keyStr, mainKey) {
    // if keyStr is not nothing
    // take the keyStr separate it by any combo of spaces and/or plus signs
    // might work with just newlist = str.separate(by +) -> newlist.separate(by spaces)?
    // take the result and then add the mainkey on the end assuming its not nothing and also its been checked to be a vliad key
}

export async function exeShortcut(context, keyList) {
    const page = await getActivePage(context);
    // pop the last key from keylist
    // for each item in keylist
    // key = key trim upper
    // if key in the imported valid keys list from puppeteer
    // page keyboard down 
    // do a press on the key that was popped
    // for the reverse of keylist
    // page keyboard up
    
}