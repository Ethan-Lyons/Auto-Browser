import puppeteer from 'puppeteer-core';
import { browserConnect } from './Browser.js';
import { resolveNumber } from './StoreVariables.js';
export * from './Find.js';
export * from './Info.js';
export * from './Click.js';
export * from './Tab.js';
export * from './Group.js';
export * from './Browser.js';
export * from './Page.js';
export * from './WebHelpers.js';
export * from './StepsHandler.js'
export * from './Store.js'
export * from './StoreVariables.js'
export * from './Conditionals.js';
export * from './Browser.js'

let browserEventHooked = false;
// Maps each browser context to its active page
const contextToPage = new WeakMap();

/**
 * Establishes a connection to the Puppeteer browser and
 *  returns the default context.
 * @returns {Promise<puppeteer.BrowserContext>} A promise that resolves
 *  with a Puppeteer browser context instance.
 * @throws Will throw an error if the connection to the browser context
 * cannot be established.
 */
export async function connectToContext() {
    const browser = await browserConnect();
    const context = await browser.defaultBrowserContext();

    // Install browser-level listener once
    if (!browserEventHooked) {
        browser.on('targetcreated', async target => {
            if (target.type() !== 'page') return;

            const newPage = await target.page();
            if (!newPage) return;

            const pageContext = newPage.browserContext();
            contextToPage.set(pageContext, newPage);
        });

        browserEventHooked = true;
    }

    return context;
}

/**
 * Creates a new browser context instance.
 * @param {puppeteer.Browser} browser The browser instance to use.
 * @returns {Promise<puppeteer.BrowserContext>} A promise that resolves with
 *  a new browser context instance.
 */
export async function createNewContext(browser) {
    const context = await browser.createBrowserContext();
    return context;
}

/**
 * Closes the given browser context and all of its pages.
 * @param {puppeteer.BrowserContext} context The browser context instance to close.
 * @throws {Error} If there is an error closing the context.
 */
export async function closeContext(context) {
    await context.close();
}


/**
 * Sets the active page in the given context.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {puppeteer.Page} page The page to set as active.
 * @throws {Error} If there is an error setting the active page.
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
 * @throws {Error} Error during execution of action.
 */
export async function getActivePage(context) {
    const page = contextToPage.get(context);
    if (context.pages().length === 0) { // check if context is empty
        console.log("Warning (getActivePage): No pages in context.");
        return null;
    }
    else if (page && !page.isClosed()) { // check if page is still open
        return page;
    }
    const pages = await context.pages();
    setActivePage(context, pages[0]);
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
    let [ms] = waitStep.args
    ms = resolveNumber(ms)
    await new Promise(r => setTimeout(r, waitStep));
}