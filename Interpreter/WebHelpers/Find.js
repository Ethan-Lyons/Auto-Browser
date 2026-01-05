import { timeout, TimeoutError } from "puppeteer-core";
import { getActivePage } from "./WebHelpers.js";
import puppeteer from 'puppeteer-core';

const SEARCH_TIMEOUT = 3000

/**
 * Finds an element based on the given selector.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {Object} findStep An object containing the information for the find action. This object should have a selector action group
 * with a selected type and value.
 * @returns {Promise<puppeteer.ElementHandle> | null} A promise that resolves with the element found.
 * @throws Will throw an error if the element cannot be found.
 */
export async function find(context, findStep) {
    let page, selectorGroup, selectorType;
    try {
        selectorGroup = findStep.args[0];
        selectorType = selectorGroup.selected;
        page = await getActivePage(context);

        if (selectorType.name == "xpath") {
            const target = selectorType.value;
            const element = await findByXPath(page, target);
            checkValidElement(element, selectorType);
            return element;
        }
        else if (selectorType.name == "id") {
            const target = selectorType.value;
            const element = await findByID(page, target);
            checkValidElement(element, selectorType);
            return element;
        }
        else if (selectorType.name == "text"){
            const target = selectorType.value;
            const element = await findByText(page, target)
            checkValidElement(element, selectorType);
            return element;
        }
        else if (selectorType.name == "css") {
            const target = selectorType.value;
            const element = await page.waitForSelector(target, {timeout: SEARCH_TIMEOUT});
            checkValidElement(element, selectorType)
            return element;
        }
        else if (selectorType.name == "link") {
            const [textArg, strictGroup] = selectorType.args;
            const strictVal = strictGroup.selected.value
            const textVal = textArg.value

            const element = await findByLinkAddress(page, textVal, strictVal);
            checkValidElement(element, textArg);
            return element;
        }
        else {
            throw new Error ("Error: Unknown find type: " + selectorType.name);
        }
    } catch (err) {
        return handleFindErrors(err, "Find (find) error")
    }
}

/**
 * Helper to find an element by its link address.
 * @param {puppeteer.Page} page The page to search for the element
 * @param {string} linkAddress The link address to search for
 * @param {string} [strict="false"] Whether to search for an exact link address or a link address that contains the given string
 * @returns {Promise<puppeteer.ElementHandle>} The element found
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

        const element = await page.waitForSelector(fullXpath, {timeout: SEARCH_TIMEOUT});
        return element;
    } catch (err) {
        return handleFindErrors(err, "Find (findByLinkAddress [strict = " + strict + "]) error")
    }
}

/**
 * Helper function to find an element by XPath.
 * @param {puppeteer.Page} page The page to search for the element
 * @param {string} xPath The XPath to search for
 * @returns {Promise<puppeteer.ElementHandle> | null} The element found
 */
async function findByXPath(page, xPath) {
    try {
        const fullXPath = 'xpath/' + xPath;
        const element = await page.waitForSelector(fullXPath, {timeout: SEARCH_TIMEOUT});
        return element;
    } catch (err) {
        return handleFindErrors(err, "Find (findByXPath) error")
    }
}

async function findByText(page, text) {
  try {
    return await page.waitForSelector( `::-p-aria([name="${text}"])`, { timeout: SEARCH_TIMEOUT });
    //await page.locator('::-p-aria(Submit)').click();
    //await page.locator('::-p-aria([name="Click me"][role="button"])').click();
  } catch {}

  try {
    return await page.waitForSelector(`text/${text}`, { timeout: SEARCH_TIMEOUT, exact:false });
  } catch {}

  return await page.waitForSelector(
    `::-p-xpath(//*[contains(normalize-space(.), "${text}")])`,
    { timeout: SEARCH_TIMEOUT }
  );
}

async function findByAria(page, aria){
    '::-p-aria(' + aria + ')';
    try {
        const fullXPath = 'xpath/' + xPath;
        const element = await page.waitForSelector(fullXPath, {timeout: SEARCH_TIMEOUT});
        return element;
    } catch (err) {
        return handleFindErrors(err, "Find (findByXPath) error")
    }
}

/**
 * Helper function to find an element by its ID.
 * @param {puppeteer.Page} page The page to search for the element
 * @param {string} id The ID of the element to search for
 * @returns {Promise<puppeteer.ElementHandle> | null} The element found
 */
async function findByID(page, id) {
    try {
        if (!(id.startsWith('#'))) { id = '#' + id}
        const element = await page.waitForSelector(id, {timeout: SEARCH_TIMEOUT});
        return element;
    } catch (err) {
        return handleFindErrors(err, "Find (findByID) error")
    }
}

/**
 * Checks if an element was found by the find function.
 * If the element was found, returns true. If not, logs a warning message with the target mode and value, and returns false.
 * @param {puppeteer.ElementHandle | null} findReturn The return value of the find function
 * @param {Object} target The target object containing the name and value of the target mode
 * @returns {boolean} True if the element was found, false otherwise
 */
function checkValidElement(findReturn, target) {
    if (findReturn) {
        return true;
    }
    else {
        console.log("Warning: Element not found. Target mode: " + target.name + " Target value: " + target.value);
        return false;
    }
}

function handleFindErrors(err, message=""){
    if (err instanceof TimeoutError) {
            console.warn(message, err.message);
            return null
        }
        else {
            throw new Error(message + ": " + err);
        }
    }