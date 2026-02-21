import { BrowserContext } from "puppeteer-core";
import { setActivePage, getTabs, getActiveIndex, assertStep,
    resolveTabIndex } from "./WebHelpers.js";

/**
 * Parses a 'tabNavStep' input and performs a tab navigation action.
 * @param {BrowserContext} context The browser context
 *  instance to use.
 * @param {{ name: "TAB_NAV", type: "Action", args: [Object]}} navStep An object
 * containing the information for the tabNav action.
 * @throws {Error} If the tab field is invalid or there
 *  is an error navigating to the tab.
 * @returns {Promise<void>} A promise that resolves when the tab navigation is complete.
 */
export async function tabNav(context, navStep) {
    const navSpec = parseTabNav(navStep);
    await exeTabNav(context, navSpec.tab);
}

/**
 * Obtains important values from a 'tabNavStep' input and returns them using an object.
 * @param {{ name: "TAB_NAV", type: "Action", args: [Object] }} navStep 
 * @returns {{ tab: string }}
 */
export function parseTabNav(navStep) {
    assertStep(navStep, "TAB_NAV", "parseTabNav");

    const [tabStep] = navStep.args;

    if (!tabStep || typeof tabStep?.value !== "string") {
        throw new Error("ParseTabNav: missing tab value or invalid tab value. Tab: " + tabStep);
    }

    return { tab: tabStep.value };
}

/**
 * Performs a tab navigation action.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {string} tabStr The string representation of the tab to navigate to.
 * @returns {Promise<void>} A promise that resolves when the tab navigation is complete.
 */
export async function exeTabNav(context, tabStr) {
    // If there are no tabs, do nothing
    const tabs = await getTabs(context);
    if (tabs.length === 0) return;

    const activeIndex = await getActiveIndex(context);
    const indexSpec = resolveTabIndex(tabStr, activeIndex, tabs.length);

    if(indexSpec.index < 0 || indexSpec.index > tabs.length - 1) {
        console.warn("Tab index out of range. Tab: " + tabStr);
        return;
    }
    
    await setActivePage(context, tabs[indexSpec.index]);
}