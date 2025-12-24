import { find } from './Find.js';
import assert from 'assert';
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
export async function click(context, selectedArg) {
    try {
        const page = await getActivePage(context);
        const foundElement = await find(context, selectedArg);
        await waitForNavClick(page, foundElement);
    } catch (err) {
        console.error('Navigation (click) error:\n', err);
        process.exit(1);
    }
}

/*export async function click(browser, clickStep) {
    // TODO: finish type support
    assert(browser instanceof puppeteer.Browser, "browser is not a Browser instance");
    try {
        selectorGroup = clickStep.args[0];
        selectedArg = selectorGroup.selected;
        page = await getActivePage(browser);

        if (selectedArg.name == "xpath") {
            target = selectedArg.value;
            const element = await findByXPath(browser, target);
            await waitForNavClick(page, element);
        }
        else if (selectedArg.name == "id") {
            target = selectedArg.value;
            const element = await findByID(browser, target);
            await waitForNavClick(page, element);
        }
        else if (selectedArg.name == "link") {
            linkType = selectedArg.selected;
                if (linkType.name == "is") {
                    target = linkType.value;
                    const element = await findByLinkAddress(browser=browser, linkAddress=target, strict=true);
                    await waitForNavClick(page, element);
                }
                else if (linkType.name == "contains") {
                    target = linkType.value;
                    const element = await findByLinkAddress(browser=browser, linkAddress=target, strict=false);
                    await waitForNavClick(page, element);
                }
            }
    } catch (err) {
        console.error('Navigation (click) error:\n', err);
        process.exit(1);
    }
}*/

/**
 * Clicks an element by its ID.
 * @param {puppeteer.Page} page The page on which to click
 * @param {string} id The ID of the element to click
 */
export async function clickID(page, id) {
    element = await findByID(page, id);
    await waitForNavClick(page, element);
}

/*async function clickLinkByText(page, text) {
    try {
        const fullXpath = '::-p-xpath(' + `//a[text()="${text}"]` + ')';
        const element = await page.waitForSelector(fullXpath);
        if (element) { 
            await waitForNavClick(page, element);
        }
    } catch (err) {
        console.log("Text: " + text + "\nfullXpath: " + fullXpath +"\n");
        console.error('Navigation (clickLinkByText) error:\n', err);
        process.exit(1);
    }
}*/