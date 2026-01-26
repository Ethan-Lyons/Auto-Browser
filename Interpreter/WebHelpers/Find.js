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
    const parsed = parseFind(findStep);
    const spec = resolveFindSpec(parsed);
    return await exeFind(context, spec);
}

export function parseFind(findStep) {
    if (!findStep || findStep.name?.toUpperCase() !== "FIND") {
        throw new Error("parseFind: input is not a FIND action. Input: " + findStep);
    }

    const selector = findStep.selected;
    if (!selector || !selector.name) {
        throw new Error("parseFind: missing selector");
    }

    return {
        mode: selector.name.toLowerCase(),
        value: selector.value,
        args: selector.args ?? []
    };
}

export function resolveFindSpec(parsed) {
    const { mode, value, args } = parsed;

    switch (mode) {
        case "xpath":
        case "text":
        case "aria":
        case "css":
            return {
                mode: mode,
                target: resolveString(value)
            };

        case "link": {
            const [textArg, strictGroup] = args;
            if (!textArg || !strictGroup?.selected) {
                throw new Error("resolveFindSpec: invalid link args");
            }

            return {
                mode: "link",
                text: resolveString(textArg.value),
                strict: resolveBoolean(strictGroup.selected.value)
            };
        }

        default:
            throw new Error(`resolveFindSpec: unknown find mode: ${mode}`);
    }
}


export async function exeFind(context, spec) {
    const page = await getActivePage(context);

    switch (spec.mode) {
        case "xpath":
            return await findByXPath(page, spec.target);

        case "text":
            return await findByText(page, spec.target);

        case "aria":
            return await findByAria(page, spec.target);

        case "css":
            return await page.locator(spec.target);

        case "link":
            return await findByLinkAddress(page, spec.text, spec.strict);

        default:
            throw new Error(`exeFind: unsupported spec kind: ${spec.kind}`);
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