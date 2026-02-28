import { BrowserContext, Locator } from 'puppeteer-core';
import { getActivePage, resolveBoolean, find, assertStep, WAIT_FOR_NAV_NAME } from './WebHelpers.js';

export const CLICK_NAME = 'CLICK';

/**
 * Parses a clickStep and performs a click action.
 * @param {BrowserContext} context The browser
 *  context instance to use.
 * @param {{name: "CLICK", type: "Action", args: [Object, Object]}} clickStep An object
 * containing the information for the click action.
 */
export async function click(context, clickStep) {
    let waitBool = false;
    const clickSpec = parseClick(clickStep);
    const locator = await find(context, clickSpec.findStep);

    if (clickSpec.waitForNav !== "") {
        waitBool = resolveBoolean(clickSpec.waitForNav);
    }

    await exeClick(context, locator, waitBool);
}

/**
 * Obtains important values from a 'clickStep' input and returns them using an object
 * @param {{name: "CLICK", type: "Action", args: [Object, Object]}} clickStep The object
 * containing the click action data.
 * @returns {{findStep: findStep, waitForNav: string}}
 */
export function parseClick(clickStep) {
    assertStep(clickStep, CLICK_NAME, 'parseClick');

    const [findStep, waitNavStep] = clickStep.args;
    assertStep(waitNavStep, WAIT_FOR_NAV_NAME, 'parseClick');
    // findStep will be asserted once the find function is called

    const waitVal = waitNavStep.selected.name;

    return {
        findStep: findStep,
        waitForNav: waitVal
    };
}

/**
 *  Function to navigate to a page by clicking on an element.
 *  Waits for the page to finish loading while navigating to the new page.
 *  @param {BrowserContext} context The browser context
 *  instance to use.
 *  @param {Locator} locator The element locator
 *  of the element to click.
 *  @param {boolean} waitForNav Whether to wait for page navigation. Defaults to false.
 *  @returns {Promise<void>} A promise that resolves when the click is completed.
 */
export async function exeClick(context, locator, waitForNav = false) {
    if (waitForNav) {   // Page navigation expected
        const page = await getActivePage(context);

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            locator.click()
        ]);

    } else {  // Page navigation not expected
        await locator.click();
    }
}