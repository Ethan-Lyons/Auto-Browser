import puppeteer from 'puppeteer-core';
import { Browser, BrowserContext, Page } from 'puppeteer-core';
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

export * from './Store.js'
export * from './StoreVariables.js'

export * from './Routine.js'
export * from './StepsHandler.js'

export * from './Conditionals/If.js'
export * from './Conditionals/While.js'
export * from './Conditionals/For.js'
export * from './Conditionals/Condition.js'

export * from './Browser.js'
export * from './UrlNav.js'

export * from './Assert.js'
export * from './Screenshot.js'
export * from './TextFile.js'

export * from './RunRoutine.js'
export * from './Keyboard.js'
export * from './Shortcut.js'
export * from './TypeText.js'


// Maps each browser context to its active page
export const contextToPage = new WeakMap();

/**
 * Sets the active page in the given context.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {Page} page The page to set as active.
 * @returns {Promise<void>} A promise that resolves when the page is set as active.
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
 * @param {BrowserContext} context The browser context instance to use.
 * @returns {Promise<Page>} The active page in the browser context.
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
 * @param {BrowserContext} context The browser context instance to use.
 * @returns {Promise<Number>} The index of the active page in the browser context.
*/
export async function getActiveIndex(context) {
    const page = await getActivePage(context);
    const pages = await context.pages();

    return pages.indexOf(page);
}

/**
 * Waits for a specified amount of time.
 * @param {{ name: "WAIT", type: "Action", args: [Object]}} waitStep An object
 * containing the information for the wait action.
 * @returns {Promise<void>} A promise that resolves when the wait is complete.
 */
export async function wait(waitStep) {
    let [ms] = waitStep.args;
    ms = resolveNumber(ms);
    await new Promise(r => setTimeout(r, ms));
}