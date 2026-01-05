import { find } from './Find.js';
import { getActivePage } from './WebHelpers.js';
import puppeteer from 'puppeteer-core';

/**
 * Helper function to navigate to a page by clicking on an element.
 * Will wait for the page to finish loading and navigate to the new page.
 * @param {puppeteer.Page} page The page to navigate
 * @param {puppeteer.ElementHandle} locator The element locator of the element to click
 */
export async function waitForNavClick(page, locator) {
    try {
        await Promise.allSettled([
            page.waitForNavigation({ waitUntil: 'networkidle0'}),
            locator.click(),
        ]);
    } catch (err) {
        throw new Error('Click (waitForNavClick) error:\n' + err);
    }
}

/**
 * Clicks on an element matching the given selector.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {Object} clickStep An object for a click action.
 *      This step should be of type action with the name value click and a find action in its args list.
 * @throws {Error} Error during execution of action.
 */
export async function click(context, clickStep) {
    try {
        const page = await getActivePage(context);
        const findStep = clickStep.args[0];
        const locator = await find(context, findStep);
        if (locator) {
            await waitForNavClick(page, locator);
        }
        else {
            console.log("Warning: Element not found: " + clickStep.name + " " + clickStep.selectedArg);
        }
        
    } catch (err) {
        throw new Error('Click (click) error:\n' + err);
    }
}