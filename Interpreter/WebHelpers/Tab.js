import { getActiveIndex, setActivePage } from "./WebHelpers.js";

/**
 * Get all tabs in the browser context.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @returns {puppeteer.Page[]} An array of tabs in the browser context.
 */
export async function getTabs(context) {
    const tabs = await context.pages();
    return tabs;
}

/**
 * Open a tab in the browser context.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @returns {puppeteer.Page} The new tab.
 * @throws {Error} If there is an error opening the tab.
 */
export async function newTab(context) {
    let page;
    try {
        page = await context.newPage();
        setActivePage(context, page);
        return page;
        
    } catch (err) {
        throw new Error('Tab (newTab) error:\n' + err);
    }
}

/**
 * Close a tab in the browser context.
 * @param {puppeteer.Page} tab The tab to close
 * @throws {Error} If there is an error closing the tab.
 */
export async function closeTab(tab) {
    try {
        if (tab != null) {
            await tab.close();
        }

    } catch (err) {
        throw new Error('Tab (closeTab) error:\n' + err);
    }
}

/**
 * Navigate to a tab in the browser context.
 * The action's tab field is used to determine which tab to navigate to.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {Object} navAction An object for a tab nav action.
 *      This step should be of type action with the name value of "tab" and a tab value in its args list.
 * @throws {Error} If the tab field is invalid or there is an error navigating to the tab.
 */
export async function navToTab(context, navAction) {
    let tabStr, index, tabs;
    try {
        tabStr = navAction.tab;
        tabs = getTabs(context);
        if (tabs.length == 0) { // no tabs
            return;
        }

        index = resolveTabIndex(tabStr, context);
        if (index == -1) {
            throw new Error('Invalid tab for navigation (navToTab):\n' + "Input: " + tabStr);
        }
        setActivePage(context, tabs[index]);
        
    } catch (err) {
        throw new Error('Tab (navToTab) error:\n' + err);
    }
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
 * @param {string|number} tabStr The tab string to resolve.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @returns {number} The resolved index value.
 * @throws {Error} If the tab string is invalid or there is an error resolving the tab string.
 */
async function resolveTabIndex(tabStr, context) {
    let intValue, index, activeIndex;
    try{
        // If the tab string is a number, resolve it to ensure it is a valid index
        if (typeof tabStr === "number") {
            tabStr = resolveTabInt(tabStr, context);
            return tabStr;
        }
        // If the tab string is a string, convert it to an index value
        else if (typeof tabStr == "string") {
            intValue = resolveStringInt(tabStr);

            // If the tab string is a number string, resolve it to an index value
            if (intValue != null) {
                index = intValue;
                return index;
            }
            // If the tab string is not a number string, resolve it to an index value relative to the current tab
            else {
                activeIndex = await getActiveIndex(context);
                index = resolveTabStrIndex(tabStr, activeIndex, context);
                return index;
            }
        }
        // If the tab string is not a string or number, throw an error
        else {
            throw new Error('Invalid input type (resolveTabIndex):\n' + "Input: " + tabStr + ", Type: " + typeof tabStr);
        }

    } catch (err) {
        throw new Error('Tab (resolveTabIndex) error:\n' + err);
    }
}

/**
 * Resolve an integer to a valid index value. Index values are in the range [0, tabs.length - 1].
 * @param {number} tabInt The integer to resolve.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @returns {number} The resolved index value.
 * @throws {Error} If there is an error resolving the integer.
 */
async function resolveTabInt(tabInt, context) {
    let index, tabs;
    try {
        tabs = getTabs(context);
        index = Math.min(Math.max(0, tabs.length - 1),Math.max(0, tabInt));
        return index;

    } catch (err) {
        throw new Error('Tab (resolveTabInt) error:\n' + err);
    }
}

/**
 * Resolve a tab string to an index value relative to the current tab.
 * The tab string should be one of the following values:
 * - "new" for a new tab.
 * - "next" or "n" for the next tab (relative to the current tab).
 * - "previous" or "prev" or "p" for the previous tab (relative to the current tab).
 * - "last" or "l" for the last tab.
 * - "first" or "f" for the first tab.
 * @param {string} tabStr The tab string to resolve.
 * @param {number} activeIndex The index of the current active tab.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @returns {number} The resolved index value.
 * @throws {Error} If the tab string is invalid or there is an error resolving the tab string.
 */
async function resolveTabStrIndex(tabStr, activeIndex, context) {
    let newReg, pReg, nReg, lReg, fReg;
    tabStr = tabStr.toLowerCase();
    newReg = /^(new)\s*$/;
    nReg = /^(next|n)\s*$/;
    pReg = /^(previous|prev|p)\s*$/;
    lReg = /^(last|l)\s*$/;
    fReg = /^(first|f)\s*$/;

    try {
        // If the tab string is "new", open a new tab and return the index of the new tab
        if (newReg.test(tabStr)) {
            await newTab(context);
            const tabs = await getTabs(context);
            return tabs.length - 1;
        }
        // If the tab string is "previous" or "prev", navigate to the previous tab
        else if (pReg.test(tabStr)) {
            index = await resolveTabInt(activeIndex - 1, context);
            return index;
        }
        // If the tab string is "next", navigate to the next tab
        else if (nReg.test(tabStr)) {
            index = await resolveTabInt(activeIndex + 1, context);
            return index;
        }
        // If the tab string is "last", navigate to the last tab
        else if (lReg.test(tabStr)) {
            const tabs = await getTabs(context);
            return tabs.length - 1;
        }
        // If the tab string is "first", navigate to the first tab
        else if (fReg.test(tabStr)) {
            return 0;
        }
        // If the tab string is not a valid tab string, throw an error
        else {
            throw new Error('Invalid tab string (resolveTabStrIndex):\n' + "Input: " + tabStr);
        }

    } catch (err) {
        throw new Error('Tab (resolveTabStrIndex) error:\n' + err);
    }
}

/**
 * Attempt to convert a string to a number.
 * @param {string|number} value The value to convert.
 * @returns {number|null} The converted number if successful, or null if not.
 * @throws {Error} If there is an error resolving the string.
 */
async function resolveStringInt(value) {
    try {
        if (typeof value === 'string') {
            const converted = Number.parseInt(value);
            // If the conversion is successful, return the converted number
            if (Number.isInteger(converted)) {
                return converted;
            }
            // If the conversion is not successful, return null
            else {
                return null;
            }
        }
        // If the value was already a number, return the value
        else if (Number.isInteger(value)) {return value;}
        // If the value is not a string or number, throw an error
        else {
            throw new Error('Invalid input type (convertStringInt):\n' + "Input: " + value + ", Type: " + typeof value);
        }

    } catch (err) {
        throw new Error('Tab (convertStringInt) error:\n' + err);
    }
}
