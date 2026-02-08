import { getActivePage, resolveString } from './WebHelpers.js';
import { BrowserContext, Page } from 'puppeteer-core';

/**
 * Parses and executes a screenshot action.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{ name: "SCREENSHOT", type: "Action", args: [Object] }} scrStep An object
 * containing the information for the screenshot action.
 * @returns {Promise<void>} A promise that resolves when the screenshot action is completed.
 */
export async function screenshot(context, scrStep, outputDir) {
    const page = await getActivePage(context);
    const scrSpec = parseScreenshot(scrStep);
    await exeScreenshot(page, scrSpec.name, outputDir);
}

/**
 * Obtains the important values from a 'screenshotStep' input and returns them using an object.
 * @param {{ name: "SCREENSHOT", type: "Action", args: [Object] }} scrStep An object
 * containing the information for the screenshot action.
 * @returns {{ name: String }}
 */
export function parseScreenshot(scrStep) {
    const [fileName] = scrStep.args;
    const name = fileName.value;

    return { name: name };
}

/**
 * Performs a screenshot of the current page and saves it to a file.
 * @param {Page} page The puppeteer page to take the screenshot from.
 * @param {String} fileName The file name to save the screenshot to. Image extension will be added if not included.
 */
export async function exeScreenshot (page, fileName, outputDir) {
    const filePath = resolveFilePath(fileName, outputDir);
    await page.screenshot({
        path: filePath,
        fullPage: true
    });
}

/**
 * Resolves a file path from a given file name for a screenshot action.
 * If the file name does not have an extension, it will be added as ".png".
 * @param {String} fileName The file name to resolve the file path from.
 * @returns {String} The resolved file path.
 * @throws {Error} If the file name is invalid.
 */
function resolveFilePath(fileName, outputDir) {
    fileName = resolveString(fileName);
    
    const regex = /^([a-zA-Z0-9_.-])+(\.(jpg|jpeg|png|gif|bmp))?$/i;
    const match = fileName.match(regex);
    if (!match) {
        throw new Error(`Invalid file name for screenshot: ${fileName}`);
    }

    let outName = match[0];
    const extension = match[2];
    if (!extension) {
        outName += ".png";
    }

    outName = outputDir + outName;

    return outName;
}