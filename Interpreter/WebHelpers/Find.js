import { getActivePage } from "./WebHelpers.js";
import puppeteer from 'puppeteer-core';

/**
 * Finds an element based on the given selector.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {Object} selectedArg An object containing the information for the find action. This object should have a selector group
 * with a selected type and value.
 * @returns {Promise<puppeteer.ElementHandle>} A promise that resolves with the element found.
 * @throws Will throw an error if the element cannot be found.
 */
export async function find(context, findStep) {
    try {
        //TODO: Find by text

        let page, selectorGroup, selectedArg;
        selectorGroup = findStep.args[0];
        selectedArg = selectorGroup.selected;
        page = await getActivePage(context);

        if (selectedArg.name == "xpath") {
            const target = selectedArg.value;
            const element = await findByXPath(page, target);
            await checkValidElement(element, selectedArg);
            return element;
        }
        else if (selectedArg.name == "id") {
            const target = selectedArg.value;
            const element = await findByID(page, target);
            await checkValidElement(element, selectedArg);
            return element;
        }
        else if (selectedArg.name == "link") {
            const linkType = selectedArg.selected;
            console.log("Link type: " + linkType.name);
                if (linkType.name == "is") {
                    //console.log("Link is: " + linkType.value);
                    const target = linkType.value;
                    const element = await findByLinkAddress(page, target, true);
                    await checkValidElement(element, linkType);
                    return element;
                }
                else if (linkType.name == "contains") {
                    //console.log("Link contains: " + linkType.value);
                    const target = linkType.value;
                    const element = await findByLinkAddress(page, target, false);
                    await checkValidElement(element, linkType);
                    return element;
                }
            }
        else {
            console.log("Warning: Unknown find type: " + selectedArg.name);
        }
    } catch (err) {
        console.error('Find (find) error:\n', err);
        process.exit(1);
    }
}

/**
 * Helper to find an element by its link address.
 * @param {puppeteer.Page} page The page to search for the element
 * @param {string} linkAddress The link address to search for
 * @param {boolean} [strict=false] Whether to search for an exact link address or a link address that contains the given string
 * @returns {puppeteer.ElementHandle} The element found
 */
async function findByLinkAddress(page, linkAddress, strict=false) {
    try {
        if (strict) { // link "is"
            const fullXpath = '::-p-xpath(' + `//a[@href="${linkAddress}"]` + ')';
            const element = await page.waitForSelector(fullXpath);
            return element;
        }
        else { // link "contains"
            const fullXpath = '::-p-xpath(' + `//a[contains(@href, "${linkAddress}")]` + ')';
            const element = await page.waitForSelector(fullXpath);
            return element;
        }
    } catch (err) {
        console.error('Find (findByLinkAddress) error:\n', err);
        process.exit(1);
    }
}

/**
 * Helper function to find an element by XPath.
 * @param {puppeteer.Page} page The page to search for the element
 * @param {string} xPath The XPath to search for
 * @returns {puppeteer.ElementHandle} The element found
 */
async function findByXPath(page, xPath) {
    try{
        const fullXPath = 'xpath/' + xPath;
        const element = await page.waitForSelector(fullXPath);
        return element;
    }
    catch (err) {
        console.error('Find (findByXPath) error:\n', err);
        process.exit(1);
    }
}

/**
 * Helper function to find an element by its ID.
 * @param {puppeteer.Page} page The page to search for the element
 * @param {string} id The ID of the element to search for
 * @returns {puppeteer.ElementHandle} The element found
 */
async function findByID(page, id) {
    try {
        if (!(id.startsWith('#'))) { id = '#' + id}
        const element = await page.waitForSelector(id);
        return element;
    } catch (err) {
        console.error('Find (findByID) error:\n', err);
        process.exit(1);
    }
}

async function checkValidElement(findReturn, target) {
    if (findReturn) {
        return true;
    }
    else {
        console.log("Warning: Element not found. Target mode: " + target.name + " Target value: " + target.value);
        return false;
    }
}