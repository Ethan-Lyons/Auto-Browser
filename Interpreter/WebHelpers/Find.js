import { getActivePage, resolveString, resolveBoolean } from "./WebHelpers.js";
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
    let page, selectorType;
    selectorType = findStep.selected;
    page = await getActivePage(context);

    if (selectorType.name == "xpath") {
        const target = resolveString(selectorType.value);
        const locator = await findByXPath(page, target);
        return locator;
    }
    else if (selectorType.name == "text"){
        const target = resolveString(selectorType.value);
        const locator = await findByText(page, target)
        return locator;
    }
    else if (selectorType.name == "aria") {
        const target = resolveString(selectorType.value);
        const locator = await findByAria(page, target);
        return locator;
    }
    else if (selectorType.name == "css") {
        const target = resolveString(selectorType.value);
        const locator = await page.locator(target);
        return locator;
    }
    else if (selectorType.name == "link") {
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
 * @param {string} [strict="false"] Whether to search for an exact link address or a link address that contains the given string
 * @returns {Promise<puppeteer.locator> | null} The locator for the element if found
 */
async function findByLinkAddress(page, linkAddress, strict = false) {
    if (!page) {
        throw new TypeError('findByLinkAddress: page is required');
    }
    if (typeof linkAddress !== 'string' || linkAddress.length === 0) {
        throw new TypeError('findByLinkAddress: linkAddress must be a non-empty string');
    }

    const fullXpath = strict
        ? `::-p-xpath(//a[@href="${linkAddress}"])`
        : `::-p-xpath(//a[contains(@href, "${linkAddress}")])`;

    return page.locator(fullXpath);
}

/**
 * Helper function to find an element by XPath.
 * @param {puppeteer.Page} page The page to search for the element
 * @param {string} xPath The XPath to search for
 * @returns {Promise<puppeteer.locator> | null} The locator for the element if found
 */
async function findByXPath(page, xPath) {
    const fullXPath = 'xpath/' + xPath;
    const locator = await page.locator(fullXPath);
    return locator;
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
    const fullXPath = '::-p-aria(' + aria + ')';
    const locator = await page.locator(fullXPath);
    return locator;
}