//TODO: Find by text
import { getActivePage } from "./WebHelpers.js";
import puppeteer from 'puppeteer-core';
import assert from 'assert';


/**
 * Finds an element based on the given selector.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {Object} selectedArg An object containing the information for the find action. This object should have a name property
 *      with a value of "xpath", "id", or "link" to indicate the type of find action to take.
 * @returns {Promise<puppeteer.ElementHandle>} A promise that resolves with the element found.
 * @throws Will throw an error if the element cannot be found.
 */
export async function find(context, selectedArg) {//findStep) {
    // TODO: finish type support
    try {
        let page;
        console.log("Running find for: " + selectedArg.name + " - " + selectedArg.value);
        //console.log("Running find: " + findStep.name + " " + findStep.type + " " + findStep.args);
        //selectorGroup = findStep.args[0];
        //selectedArg = selectorGroup.selected;
        //const page = await getActivePage(browser);
        page = await getActivePage(context);

        if (selectedArg.name == "xpath") {
            const target = selectedArg.value;
            const element = await findByXPath(page, target);
            return element;
        }
        else if (selectedArg.name == "id") {
            const target = selectedArg.value;
            const element = await findByID(page, target);
            return element;
        }
        else if (selectedArg.name == "link") {
            const linkType = selectedArg.selected;
            console.log("Link type: " + linkType.name);
                if (linkType.name == "is") {
                    console.log("Link is: " + linkType.value);
                    const target = linkType.value;
                    const element = await findByLinkAddress(page, target, true);
                    return element;
                }
                else if (linkType.name == "contains") {
                    console.log("Link contains: " + linkType.value);
                    const target = linkType.value;
                    const element = await findByLinkAddress(page, target, false);
                    return element;
                }
            }
    } catch (err) {
        console.error('Find (find) error:\n', err);
        process.exit(1);
    }
}

export async function findByLinkAddress(page, linkAddress, strict=false) {
    try {
        //const page = await getActivePage(page);
        if (strict) {
            const fullXpath = '::-p-xpath(' + `//a[@href="${linkAddress}"]` + ')';
            const element = await page.waitForSelector(fullXpath);
            return element;
        }
        else {
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
export async function findByXPath(page, xPath) {
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
export async function findByID(page, id) {
    try {
        if (!(id.startsWith('#'))) { id = '#' + id}
        const element = await page.waitForSelector(id);
        return element;
    } catch (err) {
        console.error('Find (findByID) error:\n', err);
        process.exit(1);
    }
}

/*  This should replace getGroupByAttribute but just one $ i think
export async function findByAttribute(page, type, attribute, value, strict = false) {
    try {
        //const elements = await getGroupByAttribute(page, type, attribute, value, strict);
        //console.log("Matching elements found: " + elements.length + " returning first");
        //return elements[0];
    } catch (err) {
        console.error('Navigation (getObjectByAttribute) error:\n', err);
        process.exit(1);
    }
}*/ 

async function getGroupByAttribute(page, type, attribute, value, strict=false) {
    if (strict) {   // strict
        try {
            // 'xpath/' means to locate elements by XPath
            //The Dot (.) means the current context (aka the children of the current element)
            //The type is ?
            //The attribute is ?
            //The value is ?
            const fullXPath = 'xpath/.' + `//${type}[@${attribute}="${value}"]`;
            const elements = await page.$$(fullXPath);
            return elements;
        } catch (err) {
            console.error('Find (getObjectByAttribute strict) error:\n', err);
            process.exit(1);
        }
    }
    else {  // non-strict
        try {
            const fullXPath = 'xpath/.' + `//${type}[contains(@${attribute}, "${value}")]`;
            const elements = await page.$$(fullXPath);
            return elements;
        } catch (err) {
            console.error('Find (getObjectByAttribute non-strict) error:\n', err);
            process.exit(1);
        }
    }
}