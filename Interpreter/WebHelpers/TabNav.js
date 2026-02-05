import * as Webhelpers from "./WebHelpers.js";
import { assertStep } from "./Assert.js";
import { resolveTabIndex, clampTabIndex } from "./Tab.js";

/**
 * Navigate to a tab in the browser context.
 * The action's tab field is used to determine which tab
 *  to navigate to.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @param {Object} navStep An object for a tab nav action.
 *  This step should be of type action with the name value
 *  of "tab" and a tab value in its args list.
 * @throws {Error} If the tab field is invalid or there
 *  is an error navigating to the tab.
 */
export async function tabNav(context, navStep) {
    const navSpec = parseTabNav(navStep);
    await exeTabNav(context, navSpec.tab);
}

export function parseTabNav(navStep) {
    assertStep(navStep, "TAB_NAV", "parseTabNav");

    const [tabStep] = navStep.args;

    if (!tabStep || typeof tabStep?.value !== "string") {
        throw new Error("ParseTabNav: missing tab value or invalid tab value. Tab: " + tabStep);
    }

    return { tab: tabStep.value };
}

export async function exeTabNav(context, tabStr) {
    // If there are no tabs, do nothing
    const tabs = await Webhelpers.getTabs(context);
    if (tabs.length === 0) return;

    const activeIndex = await Webhelpers.getActiveIndex(context);
    const indexSpec = resolveTabIndex(tabStr, activeIndex, tabs.length);

    if(indexSpec.index < 0 || indexSpec.index > tabs.length - 1) {
        console.warn("Tab index out of range. Tab: " + tabStr);
        return;
    }
    await Webhelpers.setActivePage(context, tabs[indexSpec.index]);
}