import { getActivePage, resolveString, resolveBoolean } from "./WebHelpers.js";
import puppeteer from 'puppeteer-core';

/**
 * Finds an element locator based on the given selector.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @param {Object} findStep An object containing the information
 *  for the find action. This object should have a selector
 *  action group with a selected type and its value.
 * @returns {Promise<puppeteer.locator>} A promise that resolves with
 *  the element locator found.
 * @throws Will throw an error if the selection method is not supported
 */
export async function find(context, findStep) {
    let page, selectorType;
    selectorType = findStep.selected;
    page = await getActivePage(context);

    if (selectorType.name == "xpath") {     // Xpath
        const target = resolveString(selectorType.value);
        const locator = await findByXPath(page, target);
        return locator;
    }
    else if (selectorType.name == "text"){  // text content
        const target = resolveString(selectorType.value);
        const locator = await findByText(page, target)
        return locator;
    }
    else if (selectorType.name == "aria") { // Aria
        const target = resolveString(selectorType.value);
        const locator = await findByAria(page, target);
        return locator;
    }
    else if (selectorType.name == "css") {  // CSS
        const target = resolveString(selectorType.value);
        const locator = await page.locator(target);
        return locator;
    }
    else if (selectorType.name == "link") { // link content
        const [textArg, strictGroup] = selectorType.args;
        const strictVal = resolveBoolean(strictGroup.selected.value);
        const textVal = resolveString(textArg.value);

        const locator = await findByLinkAddress(page, textVal, strictVal);
        return locator;
    }
    else {
        throw new Error ("Error: Unknown find type: " + selectorType.name);
    }
}

/**
 * Helper to find an element by its link address.
 * @param {puppeteer.Page} page The page to search for the element
 * @param {string} linkAddress The link address to search for
 * @param {string} [strict="false"] Whether to search for an exact address or
 *  an address that contains the given string
 * @returns {Promise<puppeteer.locator>} The locator for the element.
 */
async function findByLinkAddress(page, linkAddress, strict = false) {
    // Check if page exists
    if (!page) {
        throw new TypeError('findByLinkAddress: page is required');
    }
    // Check linkAddress type
    if (typeof linkAddress !== 'string' || linkAddress.length === 0) {  
        throw new TypeError('findByLinkAddress: linkAddress' + 
            'must be a non-empty string');
    }

    // Look for partial or exact match based on strict value
    const fullXpath = strict
        ? `::-p-xpath(//a[@href="${linkAddress}"])`
        : `::-p-xpath(//a[contains(@href, "${linkAddress}")])`;

    // Return locator
    return page.locator(fullXpath); 
}

/**
 * Helper function to find an element by XPath.
 * @param {puppeteer.Page} page The page to search for the element.
 * @param {string} xPath The XPath to search for.
 * @returns {Promise<puppeteer.locator>} The locator for the element.
 */
async function findByXPath(page, xPath) {
    const fullXPath = '::-p-xpath(' + xPath + ")";
    const locator = await page.locator(fullXPath);
    return locator;
}

/**
 * Finds an element locator based on its text content.
 *  Prioritizes aria, then text, then xpath searches.
 * @param {puppeteer.Page} page The page to search for the element.
 * @param {string} text The text content of the target element.
 * @returns {Promise<puppeteer.locator> | null} A promise that resolves
 *  with the element locator found.
 * @throws Will throw an error if the selection method is not supported
 */
async function findByText(page, text) {
  try { // Check using aria names
    return await page.locator( `::-p-aria([name="${text}"])`);

  } catch {}   // Ignore on failure

  try { // If aria fails check using text locator
    return await page.locator(`text/${text}`, { exact:false });

  } catch {}   // Ignore on failure

  // If aria and text fail, check using xpath
  return await page.locator(
    `::-p-xpath(//*[contains(normalize-space(.), "${text}")])`,);
}

/**
 * Helper function to find an element by Aria
 * @param {puppeteer.Page} page The page to search for the element.
 * @param {string} aria The aria value to search for.
 * @returns {Promise<puppeteer.locator>} The locator for the element.
 */
async function findByAria(page, aria){
    const fullXPath = '::-p-aria(' + aria + ')';
    const locator = await page.locator(fullXPath);
    return locator;
}