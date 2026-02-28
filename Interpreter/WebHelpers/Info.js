import { BrowserContext } from 'puppeteer-core';
import { getActivePage, getActiveIndex, getTabCount, assertStep } from './WebHelpers.js';

export const INFO_NAME = "INFO";
export const URL_NAME = "URL";
export const TITLE_NAME = "TITLE";
export const TAB_COUNT_NAME = "TAB_COUNT";
export const CURRENT_INDEX_NAME = "CURRENT_INDEX";

/**
 * Parses an infoStep and returns the result of the info action.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{name: "INFO", type: "ActionGroup", selected: Object}} infoStep 
 * @returns {Promise<string|number>} The result of the info action.
 */
export async function info(context, infoStep) {
    const infoSpec = parseInfo(infoStep);
    return await exeInfo(context, infoSpec.mode);
}

/**
 * Obtains important values from an 'infoStep' input and returns them using an object.
 * @param {{name: "INFO", type: "ActionGroup", selected: Object}} infoStep 
 * @returns {{ mode: string }}
 */
export function parseInfo(infoStep) {
    assertStep(infoStep, INFO_NAME, "parseInfo");

    const selected = infoStep.selected;
    const name = selected.name;

    return { mode: name };
}

/**
 * Performs an info action based on the given info mode.
 * Supported modes: URL, TITLE, TAB_COUNT, CURRENT_INDEX.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {string} mode The info mode to use.
 * @returns {Promise<string|number>} The result of the info mode action.
 */
export async function exeInfo(context, mode) {
    const upMode = mode.toUpperCase();

    switch (upMode) {
        case URL_NAME:
            return await getUrl(context);

        case TITLE_NAME:
            return await getTitle(context);

        case TAB_COUNT_NAME:
            return await getTabCount(context);

        case CURRENT_INDEX_NAME:
            return await getActiveIndex(context);

        default:
            throw new Error(`exeInfo: unsupported info mode: ${upMode}`);
    }
}

/**
 * Obtains the URL from a puppeteer page.
 * @param {BrowserContext} context The browser context instance to use.
 * @returns {Promise<string>} The URL of the page.
 */
async function getUrl(context) {
    const page = await getActivePage(context)
    if (!page) {
        console.warn("Warning (getUrl): No active page in context.");
        return null;
    }
    const url = page.url();
    return url;
}

/**
 * Obtains the title from a puppeteer page.
 * @param {BrowserContext} context The browser context instance to use.
 * @returns {Promise<string>} The title of the page.
 */
async function getTitle(context) {
    const page = await getActivePage(context);
    if (!page) {
        console.warn("Warning (getTitle): No active page in context.");
        return null;
    }
    const title = await page.title();
    return title;
}