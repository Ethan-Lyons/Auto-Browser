import { getActivePage, resolveBoolean } from "./WebHelpers.js";
import { assertStep } from "./Assert.js";
import puppeteer from 'puppeteer-core';

/**
 * Finds an element locator based on the given selector.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @param {Object} findStep An object containing the information
 *  for the find action.
 * @returns {Promise<puppeteer.locator>} A promise that resolves with
 *  the element locator found.
 * @throws Will throw an error if the selection method is not supported
 */
export async function find(context, findStep) {
    const findSpec = parseFind(findStep);
    return await exeFind(context, findSpec.mode, findSpec.step);
}

export function parseFind(findStep) {
    assertStep(findStep, "FIND", "parseFind");

    const modeStep = findStep.selected;

    return {
        mode: modeStep.name,
        step: modeStep
    };
}

export async function exeFind(context, mode, step) {
    const page = await getActivePage(context);
    const modeName = mode.toUpperCase();

    switch (modeName) {
        case "XPATH":
            const xpathSpec = parseXpath(step);
            return await findByXPath(page, xpathSpec.value);

        case "TEXT":
            const textSpec = parseText(step);
            return await findByText(page, textSpec.value);

        case "ARIA":
            const ariaSpec = parseAria(step);
            return await findByAria(page, ariaSpec.value);

        case "CSS":
            const cssSpec = parseCSS(step);
            const locator = await page.locator(cssSpec.value);
            return locator;

        case "LINK":
            const linkSpec = parseLink(step);
            return await findByLinkAddress(page, linkSpec.text, linkSpec.strict);

        default:
            throw new Error(`exeFind: unsupported find mode: ${modeName}`);
    }
}

function parseXpath(xpathStep) {
    assertStep(xpathStep, "XPATH", "parseXpath");
    return {value: xpathStep.value};
}

function parseText(textStep) {
    assertStep(textStep, "TEXT", "parseText");
    return {value: textStep.value};
}

function parseAria(ariaStep) {
    assertStep(ariaStep, "ARIA", "parseAria");
    return {value: ariaStep.value};
}

function parseCSS(cssStep) {
    assertStep(cssStep, "CSS", "parseCSS");
    return {value: cssStep.value};
}

function parseLink(linkStep) {
    assertStep(linkStep, "LINK", "parseLink");

    const [textArg, strictGroup] = linkStep.args;
    assertStep(textArg, "TEXT", "parseLink");
    assertStep(strictGroup, "STRICT", "parseLink");

    let textValue = textArg.value;
    if (!textValue) {
        throw new Error(`parseLink: text value is missing.
            Link Step:\n${JSON.stringify(linkStep)}`);
    }
    if (typeof textValue !== 'string') {
        throw new Error(`parseLink: text value is not a string.
            Link Step:\n${JSON.stringify(linkStep)}`);
    }

    let strictMode = strictGroup.selected;
    if (!strictMode) {
        throw new Error(`parseLink: strict mode is missing.
            Link Step:\n${JSON.stringify(linkStep)}`);
    }
    let boolValue = strictMode.name;
    if(!boolValue) {
        throw new Error(`parseLink: strict mode name is missing.
            Link Step:\n${JSON.stringify(linkStep)}`);
    }

    boolValue = resolveBoolean(boolValue);

    return {
        text: textValue,
        strict: boolValue
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
        throw new TypeError(`findByLinkAddress: linkAddress must be a non-empty string, but got: ${linkAddress}
            Link Step:\n${JSON.stringify(linkStep)}`);
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
    const fullXPath = `::-p-xpath(${xPath})`;
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
    const locator = await page.locator(`::-p-text(${text})`);
    return locator;
}

/**
 * Helper function to find an element by Aria
 * @param {puppeteer.Page} page The page to search for the element.
 * @param {string} aria The aria value to search for.
 * @returns {Promise<puppeteer.locator>} The locator for the element.
 */
async function findByAria(page, aria){
    const fullXPath = `::-p-aria(${aria})`;
    const locator = await page.locator(fullXPath);
    return locator;
}