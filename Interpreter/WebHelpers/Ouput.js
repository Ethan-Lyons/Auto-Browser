import { getActivePage, assertStep, screenshot, textFile } from './WebHelpers.js';
import { BrowserContext } from 'puppeteer-core';

// Default directory for output actions
export const defaultOutputDir = "./OutputFiles/"

/**
 * Parses and executes an output action.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{ name: "OUTPUT", type: "Action", args: [Object] }} outputStep An object
 * containing the information for the output action.
 * @returns {Promise<void>} A promise that resolves when the output action is completed.
 */
export async function output(context, outputStep) {
    const page = await getActivePage(context);
    const outputSpec = parseOutput(outputStep);
    await exeOutput(page, outputSpec.name);
}

/**
 * Obtains the important values from a 'outputStep' input and returns them using an object.
 * @param {{ name: "OUTPUT", type: "Action", args: [Object] }} outputStep 
 * @returns {{ name: string, step: Object }}
 */
export async function parseOutput(outputStep) {
    assertStep(outputStep, "OUTPUT", "parseOutput");

    const [canOutput] = outputStep.args;
    assertStep(canOutput, "CAN_OUTPUT", "parseOutput");

    const selected = canOutput.selected;
    return { name: selected.name, step: selected };
}

/**
 * Calls the correct output function based on the output mode.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {string} mode The output mode to use.
 * @param {Object} subStep The substep for the given output mode.
 * @returns {Promise<void>} A promise that resolves when the output action is completed.
 */
export async function exeOutput(context, mode, subStep) {
    mode = mode.toUpperCase();
    switch (mode) {
        case "SCREENSHOT":
            return await screenshot(context, subStep, defaultOutputDir);
        case "TEXT_FILE":
            return textFile(subStep, defaultOutputDir);
        default:
            throw new Error(`exeOutput: unsupported output mode: ${mode}`);
    }
}