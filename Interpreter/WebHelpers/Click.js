import { find } from './Find.js';
import { getActivePage } from './WebHelpers.js';
import puppeteer from 'puppeteer-core';

/**
 * Helper function to navigate to a page by clicking on an element.
 * Will wait for the page to finish loading and navigate to the new page.
 * @param {puppeteer.Page} page The page to navigate
 * @param {puppeteer.ElementHandle} element The element to click
 */
export async function waitForNavClick(page, element) {
    try {
        await Promise.all([
            page.waitForNavigation(),
            element.click()
        ]);
    } catch (err) {
        console.error('Navigation (waitForNavClick) error:\n', err);
        process.exit(1);
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
        const foundElement = await find(context, findStep);
        if (foundElement) {
            await waitForNavClick(page, foundElement);
        }
        else {
            console.log("Warning: Element not found: " + clickStep.name + " " + clickStep.selectedArg);
        }
        
    } catch (err) {
        console.error('Navigation (click) error:\n', err);
        process.exit(1);
    }
}