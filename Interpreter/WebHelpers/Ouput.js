import { BrowserContext } from 'puppeteer-core';
import { assertStep, screenshot, textFile } from './WebHelpers.js';

import path from "path";
import process from 'process';

// Default directory for output actions
export const OUTPUT_DIR = path.resolve(process.cwd(), "OutputFiles");

/**
 * Parses and executes an output action.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{ name: "OUTPUT", type: "Action", args: [Object] }} outputStep An object
 * containing the information for the output action.
 * @returns {Promise<void>} A promise that resolves when the output action is completed.
 */
export async function output(context, outputStep) {
    const outputSpec = parseOutput(outputStep);
    await exeOutput(context, outputSpec.name, outputSpec.step);
}

/**
 * Obtains the important values from a 'outputStep' input and returns them using an object.
 * @param {{ name: "OUTPUT", type: "Action", args: [Object] }} outputStep 
 * @returns {{ name: string, step: Object }}
 */
export function parseOutput(outputStep) {
    assertStep(outputStep, "OUTPUT", "parseOutput");

    const [canOutput] = outputStep.args;
    assertStep(canOutput, "CAN_OUTPUT", "parseOutput");
    const subOutput = canOutput.selected;

    return {
        name: subOutput.name,
        step: subOutput
    };
}

/**
 * Calls the correct output function based on the output mode.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {string} mode The output mode to use (case insensitive).
 * @param {Object} subStep The substep for the given output mode.
 * @returns {Promise<void>} A promise that resolves when the output action is completed.
 */
export async function exeOutput(context, mode, subStep) {
    const upMode = mode.toUpperCase();

    switch (upMode) {
        case "SCREENSHOT":
            return await screenshot(context, subStep, OUTPUT_DIR);
        case "TEXT_FILE":
            return textFile(subStep, OUTPUT_DIR);
        default:
            throw new Error(`exeOutput: unsupported output mode: ${mode}`);
    }
}