import { find } from './Find.js';
import { getActivePage } from './WebHelpers.js';
import puppeteer from 'puppeteer-core';
import { assertStep } from './Assert.js';

/**
 * Clicks on an element matching the given selector.
 * @param {puppeteer.BrowserContext} context The browser
 *  context instance to use.
 * @param {Object} clickStep An object for a click action.
 *  This step should be of type action with the name value
 *  'CLICK' and a 'FIND' action in its args list.
 * @throws {Error} Error during execution of action.
 */

export async function click(context, clickStep) {
    const clickSpec = parseClick(clickStep);

    const locator = await find(context, clickSpec.findStep);
    
    
    await exeClick(context, locator);
}

export function parseClick(clickStep) {
    assertStep(clickStep, 'CLICK', 'parseClick');

    const [findStep] = clickStep.args;
    return { findStep: findStep };
}

/**
 * Helper function to navigate to a page by clicking on an element.
 *  Waits for the page to finish loading while navigating to the new page.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @param {puppeteer.ElementHandle} locator The element locator
 *  of the element to click.
 */
export async function exeClick(context, locator) {
    const page = await getActivePage(context);

    await Promise.allSettled([
        page.waitForNavigation({ waitUntil: 'networkidle0'}),
        locator.click(),
    ]);
}