import { getActivePage, resolveString } from './WebHelpers.js';
import { BrowserContext, Page } from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

/**
 * Parses and executes a screenshot action.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{ name: "SCREENSHOT", type: "Action", args: [Object] }} scrStep An object
 * containing the information for the screenshot action.
 * @returns {Promise<void>} A promise that resolves when the screenshot action is completed.
 */
export async function screenshot(context, scrStep, outputDir) {
    const scrSpec = parseScreenshot(scrStep);
    await exeScreenshot(context, outputDir, scrSpec.name);
}

/**
 * Obtains the important values from a 'screenshotStep' input and returns them using an object.
 * @param {{ name: "SCREENSHOT", type: "Action", args: [Object] }} scrStep An object
 * containing the information for the screenshot action.
 * @returns {{ fileName: string }}
 */
export function parseScreenshot(scrStep) {
    const [fileNameStep] = scrStep.args;
    const fileName = fileNameStep.value;

    return { fileName: fileName };
}

/**
 * Performs a screenshot of the current page and saves it to a file.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {string} fileName The file name to save the screenshot to. Image extension will be added if not included.
 */
export async function exeScreenshot (context, outputDir, fileName)  {
    const page = await getActivePage(context);

    if (outputDir === "") {
        outputDir = "./";
    }

    // If the output directory does not exist, create it
    fs.mkdirSync(outputDir, { recursive: true });

    const filePath = resolveScrFilePath(outputDir, fileName);
    await page.screenshot({
        path: filePath,
        fullPage: true
    });
}

/**
 * Resolves a file path from a given file name for a screenshot action.
 * If the file name does not have an extension, ".png" will be appended.
 * @param {string} outputDir Base output directory.
 * @param {string} fileName File name (may include user variables).
 * @returns {string} Absolute resolved file path.
 * @throws {Error} If the file name is invalid.
 */
export function resolveScrFilePath(outputDir, fileName) {
    const resolvedName = resolveString(fileName).trim();

    // Allow alphanumeric + _ . -
    const filenameRegex = /^[a-z0-9][a-z0-9_.-]*$/i;

    if (!filenameRegex.test(resolvedName)) {
        throw new Error(
            `Invalid file name for screenshot: ${resolvedName}`
        );
    }

    // Prevent path traversal
    if (resolvedName.includes("..")) {
        throw new Error(
            `Invalid file name (path traversal not allowed): ${resolvedName}`
        );
    }

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

    let finalName = resolvedName;
    const ext = path.extname(finalName).toLowerCase();

    if (ext) {
        if (!allowedExtensions.includes(ext)) {
            throw new Error(
                `Invalid screenshot extension: ${ext}`
            );
        }
    } else {
        finalName += ".png";
    }

    return path.join(outputDir, finalName);
}