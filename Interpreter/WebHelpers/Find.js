//TODO: Find by text
import { getActivePage } from "./WebHelpers.js";
import puppeteer from 'puppeteer-core';
import assert from 'assert';


export async function find(browser, selectedArg) {//findStep) {
    // TODO: finish type support
    // Find step structure:
    // {  }
    assert(browser && browser.isConnected(), "Browser is not connected");
    try {
        console.log("Running find for: " + selectedArg.name + " - " + selectedArg.value);
        //console.log("Running find: " + findStep.name + " " + findStep.type + " " + findStep.args);
        //selectorGroup = findStep.args[0];
        //selectedArg = selectorGroup.selected;
        //const page = await getActivePage(browser);

        if (selectedArg.name == "xpath") {
            const target = selectedArg.value;
            const element = await findByXPath(browser, target);
            return element;
        }
        else if (selectedArg.name == "id") {
            const target = selectedArg.value;
            const element = await findByID(browser, target);
            return element;
        }
        else if (selectedArg.name == "link") {
            const linkType = selectedArg.selected;
            console.log("Link type: " + linkType.name);
                if (linkType.name == "is") {
                    console.log("Link is: " + linkType.value);
                    const target = linkType.value;
                    const element = await findByLinkAddress(browser, target, true);
                    return element;
                }
                else if (linkType.name == "contains") {
                    console.log("Link contains: " + linkType.value);
                    const target = linkType.value;
                    const element = await findByLinkAddress(browser, target, false);
                    return element;
                }
            }
    } catch (err) {
        console.error('Find (find) error:\n', err);
        process.exit(1);
    }
}

export async function findByLinkAddress(browser, linkAddress, strict=false) {
    try {
        const page = await getActivePage(browser);
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