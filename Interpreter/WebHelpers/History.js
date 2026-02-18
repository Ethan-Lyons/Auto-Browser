import { getActivePage } from './WebHelpers.js';
import { assertStep } from './Assert.js';
import { BrowserContext } from 'puppeteer-core';

/**
 * Parses a historyStep and performs a history action.
 * @param { BrowserContext } context 
 * @param {{ name: "HISTORY", type: "Action", args: [Object] }} historyStep An object
 * containing the information for the history action.
 * @returns {Promise<void>} A promise that resolves when the history action is completed.
 */
export async function history(context, historyStep) {
    const historySpec = parseHistory(historyStep);
    await exeHistory(context, historySpec.mode);
}

/**
 * Obtains important values from a 'historyStep' input and returns them using an object.
 * @param {{ name: "HISTORY", type: "Action", args: [Object] }} historyStep 
 * @returns {{ mode: string }}
 */
export function parseHistory(historyStep) {
    assertStep(historyStep, "HISTORY", "parseHistory");

    const [historyMode] = historyStep.args;
    const selectedMode = historyMode.selected;
    const name = selectedMode.name;
    
    return { mode: name };
}

/**
 * Performs a history action based on the given history mode.
 * @param { BrowserContext } context The browser context instance to use.
 * @param {string} mode The history mode to use.
 */
export async function exeHistory(context, mode) {
    mode = mode.toUpperCase();
    const page = await getActivePage(context);
    switch (mode) {
        case "GO_FORWARD":
            await page.goForward();
            break;
        case "GO_BACK":
            await page.goBack();
            break;
        default:
            throw new Error(`exeHistory: unsupported history mode: ${mode}`);
    }
}