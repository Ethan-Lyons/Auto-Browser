import { find } from './Find.js';
import { getActivePage } from './WebHelpers.js';
import { BrowserContext, ElementHandle } from 'puppeteer-core';
import { assertStep } from './Assert.js';

/**
 * Parses a clickStep and performs a click action.
 * @param {BrowserContext} context The browser
 *  context instance to use.
 * @param {{name: "CLICK", type: "Action", args: [Object]}} clickStep An object
 * for a click action.
 */
export async function click(context, clickStep) {
    const clickSpec = parseClick(clickStep);
    const locator = await find(context, clickSpec.findStep);
    
    await exeClick(context, locator);
}

/**
 * Obtains important values from a 'clickStep' input and returns them using an object
 * @param {{name: "CLICK", type: "Action", args: [Object]}} clickStep The object
 * containing the click action data.
 * @returns {{ findStep: findStep }} An object containing containing a 'findStep' entry.
 */
export function parseClick(clickStep) {
    assertStep(clickStep, 'CLICK', 'parseClick');

    const [findStep] = clickStep.args;
    return { findStep: findStep };
}

/**
 *  Function to navigate to a page by clicking on an element.
 *  Waits for the page to finish loading while navigating to the new page.
 *  @param {BrowserContext} context The browser context
 *  instance to use.
 *  @param {ElementHandle} locator The element locator
 *  of the element to click.
 *  @returns {Promise<void>} A promise that resolves when the click is completed.
 */
export async function exeClick(context, locator) {
    const page = await getActivePage(context);

    await Promise.allSettled([  // Wait for page load
        page.waitForNavigation({ waitUntil: 'networkidle0'}),
        locator.click(),
    ]);
}