import { getActiveIndex, setActivePage } from "./WebHelpers.js";
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
    return tabs.length();
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

/**
 * Navigate to a tab in the browser context.
 * The action's tab field is used to determine which tab
 *  to navigate to.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @param {Object} navAction An object for a tab nav action.
 *  This step should be of type action with the name value
 *  of "tab" and a tab value in its args list.
 * @throws {Error} If the tab field is invalid or there
 *  is an error navigating to the tab.
 */
export async function navToTab(context, navAction) {
    const tabStr = navAction.tab;
    const tabs = await getTabs(context);
    // Case insensitive, ignores extra spaces
    const newReg = /^\s*(new)\s*$/i;

    // If the tab string is "new", open a new tab
    if (newReg.test(tabStr)) {
        await newTab(context);
        return;
    }
    // If there are no tabs, do nothing
    else if (tabs.length === 0) {
        return;
    }

    const index = await resolveTabIndex(tabStr, context);
    await setActivePage(context, tabs[index]);
}

/**
 * Resolve a tab string to an index value.
 * The tab string should be one of the following values:
 * - A number for the index of the tab to navigate to.
 * - "new" for a new tab.
 * - "next" for the next tab (relative to the current tab).
 * - "previous" for the previous tab (relative to the current tab).
 * - "last" for the last tab.
 * - "first" for the first tab.
 * @param {string|number} tabIndex The tab index to resolve.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @returns {Promise<number>} The resolved index value.
 * @throws {Error} If the tab string is invalid or there is
 * an error resolving the tab string.
 */
async function resolveTabIndex(tabIndex, context) {
    let index;
    // If the tab is a number, ensure it is a valid int.
    if (typeof tabIndex === "number") {
        tabIndex = await resolveTabInt(tabIndex, context);
        return tabIndex;
    }
    // If the tab is a string, convert it to a valid int.
    else if (typeof tabIndex == "string") {
        const intValue = await resolveStringInt(tabIndex);

        // If the tab is a number string, resolve it to a valid int
        if (intValue != null) {
            index = await resolveTabInt(intValue, context);
            return index;
        }
        // If the tab is a special string, resolve it to
        //  an index value relative to the current tab
        else {
            const activeIndex = await getActiveIndex(context);
            index = await resolveTabStrIndex(tabIndex, activeIndex, context);
            return index;
        }
    }
    // If the tab string is not a string or number, throw an error
    else {
        throw new Error('Invalid input type (resolveTabIndex):\n' +
            "Input: " + tabIndex + ", Type: " + typeof tabIndex);
    }
}

/**
 * Resolve an integer to a valid index value. Index values are
 *  in the range [0, tabs.length - 1].
 * @param {number} tabInt The integer to resolve.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @returns {Promise<number>} The resolved index value.
 * @throws {Error} If there is an error resolving the integer.
 */
async function resolveTabInt(tabInt, context) {
    const tabs = await getTabs(context);
    const index = Math.min(Math.max(0, tabs.length - 1),Math.max(0, tabInt));
    return index;
}

/**
 * Resolve a tab string to an index value relative to the current tab.
 * The tab string should be one of the following values (case isensetive):
 * - "new" for a new tab.
 * - "next" or "n" for the next tab (relative to current).
 * - "previous" or "prev" or "p" for the previous tab (relative to current).
 * - "last" or "l" for the last tab.
 * - "first" or "f" for the first tab.
 * @param {string} tabStr The tab string to resolve.
 * @param {number} activeIndex The index of the current
 *  active tab.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @returns {Promise<number>} The resolved index value.
 * @throws {Error} If the tab string is invalid or there is an
 *  error resolving the tab string.
 */
async function resolveTabStrIndex(tabStr, activeIndex, context) {
    const nReg = /^(next|n)\s*$/i;
    const pReg = /^(previous|prev|p)\s*$/i;
    const lReg = /^(last|l)\s*$/i;
    const fReg = /^(first|f)\s*$/i;
    // If tabStr is 'previous', return current tab - 1
    if (pReg.test(tabStr)) {
        const index = await resolveTabInt(activeIndex - 1, context);
        return index;
    }
    // If tabStr is 'next', return current tab + 1
    else if (nReg.test(tabStr)) {
        const index = await resolveTabInt(activeIndex + 1, context);
        return index;
    }
    // If tabStr is 'last', return the last tab
    else if (lReg.test(tabStr)) {
        const tabs = await getTabs(context);
        return tabs.length - 1;
    }
    // If tabStr is 'first', return tab 0
    else if (fReg.test(tabStr)) {
        return 0;
    }
    // If tabStr is not a valid tab string, throw an error
    else {
        throw new Error('Invalid tab index (resolveTabStrIndex):\n' +
            "Input: " + tabStr);
    }
}

/**
 * Attempt to convert a string to a number.
 * @param {string|number} value The value to convert.
 * @returns {Promise<number|null>} The converted number
 *  if successful, or null if not.
 * @throws {Error} If the input is not a string or number.
 */
async function resolveStringInt(value) {
    if (typeof value === 'string') {
        const converted = Number.parseInt(value);
        // If the conversion is successful, return the converted number
        if (Number.isInteger(converted)) {
            return converted;
        }
        // If the conversion is not successful, return null
        else { return null; }
    }
    // If the value was already a number, return the value
    else if (Number.isInteger(value)) {return value;}
    // If the value is not a string or number, throw an error
    else {
        throw new Error('Invalid input type (convertStringInt):\n' +
            "Input: " + value + ", Type: " + typeof value);
    }
}
