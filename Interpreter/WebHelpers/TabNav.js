import * as Webhelpers from "./WebHelpers.js";

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
export async function tabNav(context, navAction) {
    const targetTab = parseTabNav(navAction);
    await exeTabNav(context, targetTab);
}

export function parseTabNav(navAction) {
    const [tabStep] = navAction.args;

    if (!tabStep || typeof tabStep.value !== "string") {
        throw new Error("Tab navigation requires a string argument");
    }

    return tabStep.value.trim().toLowerCase();
}

export async function exeTabNav(context, tabStr) {
    // If there are no tabs, do nothing
    const tabs = await Webhelpers.getTabs(context);
    if (tabs.length === 0) return;

    const activeIndex = await Webhelpers.getActiveIndex(context);
    const target = resolveTabTarget(tabStr, activeIndex, tabs.length).index;

    const index = clampTabIndex(target, tabs.length);
    await Webhelpers.setActivePage(context, tabs[index]);
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
 * @returns {Promise<number>} The resolved index value.
 * @throws {Error} If the tab string is invalid.
 */
export function resolveTabTarget(tabStr, activeIndex, tabCount) {
    const nReg   = /^\s*(next|n)\s*$/i;
    const pReg   = /^\s*(previous|prev|p)\s*$/i;
    const lReg   = /^\s*(last|l)\s*$/i;
    const fReg   = /^\s*(first|f)\s*$/i;

    if (pReg.test(tabStr)) {
        return { index: activeIndex - 1 };
    }

    if (nReg.test(tabStr)) {
        return { index: activeIndex + 1 };
    }

    if (lReg.test(tabStr)) {
        return { index: tabCount - 1 };
    }

    if (fReg.test(tabStr)) {
        return { index: 0 };
    }

    const parsed = Number(tabStr);
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
 * @returns {Promise<number>} The resolved index value.
 * @throws {Error} If there is an error resolving the integer.
 */
export function clampTabIndex(index, tabCount) {
    if (tabCount <= 0) return 0;

    const maxIndex = tabCount - 1;
    return Math.min(Math.max(index, 0), maxIndex);
}