import { getActivePage, getActiveIndex } from './WebHelpers.js';
import { getTabCount } from './WebHelpers.js';
import { assertStep } from './Assert.js';
import { BrowserContext, Page } from 'puppeteer-core';

/**
 * Parses an infoStep and returns the result of the info action.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{name: "INFO", type: "ActionGroup", selected: Object}} infoStep 
 * @returns {Promise<string>} The result of the info action.
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
    assertStep(infoStep, "INFO", "parseInfo");

    const selected = infoStep.selected;
    const name = selected.name
    return { mode: name };
}

/**
 * Performs an info action based on the given info mode.
 * Supported modes: URL, TITLE, TAB_COUNT, CURRENT_INDEX.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {string} mode The info mode to use.
 * @returns {Promise<string>} The result of the info mode action.
 */
export async function exeInfo(context, mode) {
    let page;
    mode = mode.toUpperCase();
    switch (mode) {
        case "URL":
            page = await getActivePage(context);
            return getUrl(page);

        case "TITLE":
            page = await getActivePage(context);
            return await getTitle(page);

        case "TAB_COUNT":
            return await getTabCount(context);

        case "CURRENT_INDEX":
            return await getActiveIndex(context);

        default:
            throw new Error(`exeInfo: unsupported info mode: ${mode}`);
    }
}

/**
 * Obtains the URL from a puppeteer page.
 * @param {Page} page The page to get the URL from.
 * @returns {Promise<string>} The URL of the page.
 */
function getUrl(page) {
    if (!page) {
        console.warn("Warning (getUrl): No active page in context.");
        return null;
    }
    const url = page.url();
    return url;
}

/**
 * Obtains the title from a puppeteer page.
 * @param {Page} page The page to get the title from.
 * @returns {Promise<string>} The title of the page.
 */
async function getTitle(page) {
    if (!page) {
        console.warn("Warning (getTitle): No active page in context.");
        return null;
    }
    const title = await page.title();
    return title;
}