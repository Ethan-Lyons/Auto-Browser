import puppeteer from 'puppeteer-core';
import { resolveNumber } from './StoreVariables.js';
export * from './Find.js';
export * from './FindAlt.js';
export * from './Info.js';
export * from './Click.js';
export * from './Tab.js';
export * from './TabNav.js';
export * from './Group.js';
export * from './Browser.js';
export * from './Ouput.js';
export * from './WebHelpers.js';
export * from './StepsHandler.js'
export * from './Store.js'
export * from './StoreVariables.js'
export * from './If.js'
export * from './While.js'
export * from './For.js'
export * from './Condition.js'
export * from './Browser.js'
export * from './UrlNav.js'

// Maps each browser context to its active page
export const contextToPage = new WeakMap();

export const defaultOutputDir = "./OutputFiles/"

/**
 * Sets the active page in the given context.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {puppeteer.Page} page The page to set as active.
 */
export async function setActivePage(context, page) {
    contextToPage.set(context, page);
    await page.bringToFront();
}

/**
 * Retrieves the active page in the browser context.
 * If there are no pages in the context, return null.
 * If the current active page is still open, return it.
 * Otherwise, set the first page in the context as the active page and return it.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @returns {Promise<puppeteer.Page>} The active page in the browser context.
 */
export async function getActivePage(context) {
    const page = contextToPage.get(context);
    const pages = await context.pages()
    if (pages.length === 0) { // check if context is empty
        console.warn("Warning (getActivePage): No pages in context.");
        return null;
    }
    else if (page && !page.isClosed()) { // check if page is still open
        return page;
    }
    await setActivePage(context, pages[0]);
    return pages[0]; // deterministic fallback
}

/**
 * Retrieves the index of the active page in the browser context.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @returns {Promise<number>} The index of the active page in the browser context.
*/
export async function getActiveIndex(context) {
    const page = await getActivePage(context);
    const pages = await context.pages();
    return pages.indexOf(page);
}

/**
 * Waits for a specified amount of time.
 * @param {Object} waitStep An object for a wait action.
 *  This step should be of type action with the name value
 *  'WAIT' and a single argument for the milliseconds to wait.
 */
export async function wait(waitStep) {
    let [ms] = waitStep.args;
    ms = resolveNumber(ms);
    await new Promise(r => setTimeout(r, waitStep));
}