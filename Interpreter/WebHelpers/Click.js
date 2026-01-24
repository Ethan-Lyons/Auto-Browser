import { find } from './Find.js';
import { getActivePage } from './WebHelpers.js';
import puppeteer from 'puppeteer-core';

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
    const page = await getActivePage(context);
    const findStep = parseClick(clickStep);
    const locator = await find(context, findStep);
    await exeClick(page, locator);
}

export function parseClick(clickStep) {
    if(!clickStep || clickStep.name?.toUpperCase() != "CLICK") {
        throw new Error("ParseClick: input is not a click action. Input: " + clickStep);
    }

    const [findStep] = clickStep.args;
    return findStep;
}

/**
 * Helper function to navigate to a page by clicking on an element.
 *  Waits for the page to finish loading while navigating to the new page.
 * @param {puppeteer.Page} page The page to navigate from.
 * @param {puppeteer.ElementHandle} locator The element locator
 *  of the element to click.
 */
export async function exeClick(page, locator) {
    await Promise.allSettled([
        page.waitForNavigation({ waitUntil: 'networkidle0'}),
        locator.click(),
    ]);
}