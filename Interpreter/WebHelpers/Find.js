import { timeout, TimeoutError } from "puppeteer-core";
import { getActivePage } from "./WebHelpers.js";
import puppeteer from 'puppeteer-core';

/**
 * Finds an element locator based on the given selector.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {Object} findStep An object containing the information for the find action. This object should have a selector action group
 * with a selected type and value.
 * @returns {Promise<puppeteer.locator> | null} A promise that resolves with the element locator found.
 * @throws Will throw an error if the element locator cannot be found.
 */
export async function find(context, findStep) {
    let page, selectorGroup, selectorType;
    try {
        selectorGroup = findStep.args[0];
        selectorType = selectorGroup.selected;
        page = await getActivePage(context);

        if (selectorType.name == "xpath") {
            const target = selectorType.value;
            const locator = await findByXPath(page, target);
            return locator;
        }
        else if (selectorType.name == "text"){
            const target = selectorType.value;
            const locator = await findByText(page, target)
            return locator;
        }
        else if (selectorType.name == "aria") {
            const target = selectorType.value;
            const locator = await findByAria(page, target)
            return locator;
        }
        else if (selectorType.name == "css") {
            const target = selectorType.value;
            const locator = await page.locator(target);
            return locator;
        }
        else if (selectorType.name == "link") {
            const [textArg, strictGroup] = selectorType.args;
            const strictVal = strictGroup.selected.value
            const textVal = textArg.value

            const locator = await findByLinkAddress(page, textVal, strictVal);
            return locator;
        }
        else {
            throw new Error ("Error: Unknown find type: " + selectorType.name);
        }
    } catch (err) {
        throw new Error('Find (find) error:\n' + err);
    }
}

/**
 * Helper to find an element by its link address.
 * @param {puppeteer.Page} page The page to search for the element
 * @param {string} linkAddress The link address to search for
 * @param {string} [strict="false"] Whether to search for an exact link address or a link address that contains the given string
 * @returns {Promise<puppeteer.locator> | null} The locator for the element if found
 */
async function findByLinkAddress(page, linkAddress, strict="false") {
    let fullXpath;
    try {
        if (strict == true) { // link "is"
            fullXpath = '::-p-xpath(' + `//a[@href="${linkAddress}"]` + ')';
        }
        else { // link "contains"
            fullXpath = '::-p-xpath(' + `//a[contains(@href, "${linkAddress}")]` + ')';
        }

        const locator = await page.locator(fullXpath);
        return locator;
    } catch (err) {
        throw new Error('Find (findByLinkAddress [strict = ' + strict + ']) error:\n' + err);
    }
}

/**
 * Helper function to find an element by XPath.
 * @param {puppeteer.Page} page The page to search for the element
 * @param {string} xPath The XPath to search for
 * @returns {Promise<puppeteer.locator> | null} The locator for the element if found
 */
async function findByXPath(page, xPath) {
    try {
        const fullXPath = 'xpath/' + xPath;
        const locator = await page.locator(fullXPath);
        return locator;
    } catch (err) {
        throw new Error('Find (findByXPath) error:\n' + err);
    }
}

async function findByText(page, text) {
  try {
    return await page.locator( `::-p-aria([name="${text}"])`);

  } catch {}

  try {
    return await page.locator(`text/${text}`, { exact:false });
  } catch {}

  return await page.locator(
    `::-p-xpath(//*[contains(normalize-space(.), "${text}")])`,);
}

async function findByAria(page, aria){

    try {
        const fullXPath = '::-p-aria(' + aria + ')';
        const locator = await page.locator(fullXPath);
        return locator;
    } catch (err) {
        throw new Error('Find (findByAria) error:\n' + err);
    }
}