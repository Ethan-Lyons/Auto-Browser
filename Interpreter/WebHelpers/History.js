import { BrowserContext } from 'puppeteer-core';
import { getActivePage, assertStep } from './WebHelpers.js';

export const HISTORY_NAME = "HISTORY";
export const HISTORY_MODE_NAME = "HISTORY_MODE";
export const GO_FORWARD_NAME = "GO_FORWARD";
export const GO_BACK_NAME = "GO_BACK";

/**
 * Parses a historyStep and performs a history action.
 * @param {BrowserContext} context 
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
    assertStep(historyStep, HISTORY_NAME, "parseHistory");

    const [historyMode] = historyStep.args;
    assertStep(historyMode, HISTORY_MODE_NAME, "parseHistory");
    
    const selectedMode = historyMode.selected;
    const name = selectedMode.name;
    
    return { mode: name };
}

/**
 * Performs a history action based on the given history mode.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {string} mode The history mode to use (case insensitive).
 */
export async function exeHistory(context, mode) {
    const upMode = mode.toUpperCase();
    const page = await getActivePage(context);

    switch (upMode) {
        case GO_FORWARD_NAME:
            await page.goForward();
            break;
        case GO_BACK_NAME:
            await page.goBack();
            break;
        default:
            throw new Error(`exeHistory: unsupported history mode: ${upMode}`);
    }
}