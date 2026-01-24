import { setActivePage } from "./WebHelpers.js";
const DEFAULT_TIMEOUT = 3000

/**
 * Get all tabs in the browser context.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @returns {Promise<puppeteer.Page[]>} An array of tabs in
 *  the browser context.
 */
export async function getTabs(context) {
    const tabs = await context.pages();
    return tabs;
}

/**
 * Get the number of tabs in the browser context.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @returns {Promise<number>} The number of tabs in the
 *  browser context.
 */
export async function getTabCount(context) {
    const tabs = await context.pages();
    return tabs.length;
}

/**
 * Open a tab in the browser context.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @returns {Promise<puppeteer.Page>} The new tab.
 * @throws {Error} If there is an error opening the tab.
 */
export async function newTab(context) {
    const newPage = await context.newPage();
    await setActivePage(context, newPage);
    newPage.setDefaultTimeout(DEFAULT_TIMEOUT)
    return newPage;
}

/**
 * Close a tab in the browser context.
 * @param {puppeteer.Page} tab The tab to close
 */
export async function closeTab(tab) {
    if (tab != null) {
        await tab.close();
    }
}
