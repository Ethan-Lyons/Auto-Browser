import { assertStep } from "./Assert.js";
import { setActivePage, getActiveIndex } from "./WebHelpers.js";
import { resolveString } from "./WebHelpers.js";
const DEFAULT_TIMEOUT = 4000

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
export async function closeTab(context, closeTabStep) {
    const closeTabSpec = parseCloseTab(closeTabStep);
    await exeCloseTab(context, closeTabSpec.tab);
}

export function parseCloseTab(closeTabStep) {
    assertStep(closeTabStep, "CLOSE_TAB", "parseCloseTab");
    const [tabStep] = closeTabStep.args;
    return { tab: tabStep.value };
}

export async function exeCloseTab(context, tab){
    // If there are no tabs, do nothing
    const tabs = await getTabs(context);
    const tabCount = tabs.length;
    if (tabCount === 0) return;

    const currIndex = await getActiveIndex(context);
    const tabIndexSpec = resolveTabIndex(tab, currIndex, tabCount);

    // If the tab index is out of range, do nothing
    if (tabIndexSpec.index < 0 || tabIndexSpec.index > tabCount - 1) return;

    await tabs[tabIndexSpec.index].close();
}

/**
 * Resolve a tab string to a valid index value.
 * The tab string should be one of the following values:
 * - A number string for the index of the tab to navigate to.
 * - "next" for the next tab (relative to the current tab).
 * - "previous" for the previous tab (relative to the current tab).
 * - "last" for the last tab.
 * - "first" for the first tab.
 * Note that strings are case insensitive and abbreviations
 *  are also allowed.
 * @param {string|number} tabIndex The tab index to resolve.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @returns {{index: number}} The resolved index value.
 * @throws {Error} If the tab string is invalid.
 */
export function resolveTabIndex(tabStr, currIndex, tabCount) {
    tabStr = resolveString(tabStr);
    tabStr = tabStr.trim().toUpperCase();
    const nReg = /^(NEXT|N)$/i;
    const pReg = /^(PREVIOUS|PREV|P)$/i;
    const lReg = /^(LAST|L)$/i;
    const fReg = /^(FIRST|F)$/i;

    if (tabStr === "") {
        return { index: currIndex };
    }

    if (pReg.test(tabStr)) {
        return { index: currIndex - 1 };
    }

    if (nReg.test(tabStr)) {
        return { index: currIndex + 1 };
    }

    if (lReg.test(tabStr)) {
        return { index: tabCount - 1 };
    }

    if (fReg.test(tabStr)) {
        return { index: 0 };
    }

    let parsed = Number(tabStr);
    if (Number.isInteger(parsed)) {
        return { index: parsed };
    }

    throw new Error(`Invalid tab nav string: ${tabStr}`);
}

/**
 * Resolve an integer to a valid index value. Index values are
 *  in the range [0, tabCount - 1].
 * @param {number} tabInt The integer to resolve.
 * @param {number} tabCount The number of tabs.
 * @returns {<number>} The resolved index value.
 * @throws {Error} If there is an error resolving the integer.
 */
export function clampTabIndex(index, tabCount) {
    if (tabCount <= 0) return 0;

    const maxIndex = tabCount - 1;
    return Math.min(Math.max(index, 0), maxIndex);
}