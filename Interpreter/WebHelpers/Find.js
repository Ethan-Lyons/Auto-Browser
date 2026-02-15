import { getActivePage, resolveBoolean } from "./WebHelpers.js";
import { assertStep } from "./Assert.js";
import { BrowserContext, Locator, Page } from 'puppeteer-core';

/**
 * Parses a findStep and returns the element locator found.
 * @param {BrowserContext} context The browser context
 *  instance to use.
 * @param {{name: "FIND", type: "ActionGroup", selected: Object}} findStep An object containing the information
 *  for the find action.
 * @returns {Promise<Locator>} A promise that resolves with
 *  the element locator found.
 * @throws Will throw an error if the selection method is not supported
 */
export async function find(context, findStep) {
    const findSpec = parseFind(findStep);
    return await exeFind(context, findSpec.mode, findSpec.step);
}

/**
 * Obtains important values from a 'findStep' input and returns them using an object.
 * @param {{name: "FIND", type: "ActionGroup", selected: Object}} findStep 
 * @returns {{ mode: String, step: Object }} An object containing containing a 'mode' and 'step' entry.
 */
export function parseFind(findStep) {
    assertStep(findStep, "FIND", "parseFind");

    const modeStep = findStep.selected;

    return {
        mode: modeStep.name,
        step: modeStep
    };
}

/**
 * Performs a find action based on the given find mode and substep.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {String} mode The find mode to use.
 * @param {Object} subStep The substep for the given find mode.
 * @throws Will throw an error if the selection method is not supported
 * @returns {Promise<Locator>} A promise that resolves with the element locator found.
 */
export async function exeFind(context, mode, subStep) {
    const page = await getActivePage(context);
    const modeName = mode.toUpperCase();

    switch (modeName) {
        case "XPATH":
            const xpathSpec = parseXpath(subStep);
            return findByXPath(page, xpathSpec.value);

        case "TEXT":
            const textSpec = parseText(subStep);
            return findByText(page, textSpec.value);

        case "ARIA":
            const ariaSpec = parseAria(subStep);
            return findByAria(page, ariaSpec.value);

        case "CSS":
            const cssSpec = parseCSS(subStep);
            const locator = page.locator(cssSpec.value);
            return locator;

        case "LINK":
            const linkSpec = parseLink(subStep);
            return findByLinkAddress(page, linkSpec.text, linkSpec.strict);

        default:
            throw new Error(`exeFind: unsupported find mode: ${modeName}`);
    }
}

/**
 * Obtains important values from a 'xpathStep' input and returns them using an object.
 * @param {{name: "XPATH", type: "Argument", value: String}} xpathStep The step to parse.
 * @returns {{value: String}}
 */
function parseXpath(xpathStep) {
    assertStep(xpathStep, "XPATH", "parseXpath");
    return {value: xpathStep.value};
}

/**
 * Obtains important values from a 'textStep' input and returns them using an object.
 * @param {{name: "TEXT", type: "Argument", value: String}} textStep The step to parse.
 * @returns {{value: String}}
 */
function parseText(textStep) {
    assertStep(textStep, "TEXT", "parseText");
    return {value: textStep.value};
}

/**
 * Obtains important values from a 'ariaStep' input and returns them using an object.
 * @param {{name: "ARIA", type: "Argument", value: String}} ariaStep The step to parse.
 * @returns {{value: String}}
 */
function parseAria(ariaStep) {
    assertStep(ariaStep, "ARIA", "parseAria");
    return {value: ariaStep.value};
}

/**
 * Obtains important values from a 'cssStep' input and returns them using an object.
 * @param {{name: "CSS", type: "Argument", value: String}} cssStep The step to parse.
 * @returns {{value: String}}
 */
function parseCSS(cssStep) {
    assertStep(cssStep, "CSS", "parseCSS");
    return {value: cssStep.value};
}

/**
 * Obtains important values from a 'linkStep' input and returns them using an object
 * @param {{ name: "LINK", type: "Action", args: [Object, Object] }} linkStep 
 * @returns {{ text: String, strict: Boolean }}
 */
function parseLink(linkStep) {
    assertStep(linkStep, "LINK", "parseLink");

    // Parse and validate arguments
    const [textArg, strictGroup] = linkStep.args;
    assertStep(textArg, "TEXT", "parseLink");
    assertStep(strictGroup, "STRICT", "parseLink");

    // Check that text value is present and valid
    let textValue = textArg.value;
    if (!textValue) {
        throw new Error(`parseLink: text value is missing.
            Link Step:\n${JSON.stringify(linkStep)}`);
    }
    if (typeof textValue !== 'String') {
        throw new Error(`parseLink: text value is not a String.
            Link Step:\n${JSON.stringify(linkStep)}`);
    }

    // Check that strict mode and its value are present and valid
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

    boolValue = resolveBoolean(boolValue);  // Handle variable inputs and parse for a boolean

    return {
        text: textValue,
        strict: boolValue
    }
}


/**
 * Helper to find an element by its link address.
 * @param {Page} page The page to search for the element.
 * @param {String} linkAddress The link address to search for.
 * @param {String} [strict="false"] Whether to search for an exact address or
 *  an address that contains the given String.
 * @returns {Locator} The locator for the found element.
 */
function findByLinkAddress(page, linkAddress, strict = false) {
    // Check if page exists
    if (!page) {
        throw new TypeError('findByLinkAddress: page is required');
    }
    // Check linkAddress type
    if (typeof linkAddress !== 'String' || linkAddress.length === 0) {  
        throw new TypeError(`findByLinkAddress: linkAddress must be a non-empty String, but got: ${linkAddress}
            Link Step:\n${JSON.stringify(linkStep)}`);
    }

    // Look for partial or exact match based on strict value
    const selector = strict
        ? `::-p-xpath(//a[@href="${linkAddress}"])`
        : `::-p-xpath(//a[contains(@href, "${linkAddress}")])`;

    // Return locator
    return page.locator(selector); 
}

/**
 * Helper function to find an element by XPath.
 * @param {Page} page The page to search for the element.
 * @param {String} xPath The XPath to search for.
 * @returns {Locator} The locator for the element.
 */
async function findByXPath(page, xPath) {
    const selector = `::-p-xpath(${xPath})`;
    const locator = page.locator(selector);
    return locator;
}

/**
 * Finds an element locator based on its text content.
 * @param {Page} page The page to search for the element.
 * @param {String} text The text content of the target element.
 * @returns {Locator} A promise that resolves
 *  with the element locator found.
 */
function findByText(page, text) {
    const selector = `::-p-text(${text})`
    const locator = page.locator(selector);
    return locator;
}

/**
 * Helper function to find an element by Aria
 * @param {Page} page The page to search for the element.
 * @param {String} aria The aria value to search for.
 * @returns {Locator} The locator for the element.
 */
function findByAria(page, aria){
    const selector = `::-p-aria(${aria})`;
    const locator = page.locator(selector);
    return locator;
}