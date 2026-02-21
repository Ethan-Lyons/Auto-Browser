import { resolveString, assertStep } from './WebHelpers.js';

import fs from 'fs';
import path from 'path';

/**
 * Parses and executes a text file output action.
 * @param {{name: "TEXT_FILE", type: "Action", args: [Object, Object, Object]}} tfStep An object
 * containing the information for the text file action.
 * @param {string} outputDir The directory to save the text file to.
 */
export function textFile(tfStep, outputDir) {
    const tfSpec = parseTextFile(tfStep);

    if (outputDir === "") {
        outputDir = "./";
    }

    // If the output directory does not exist, create it
    fs.mkdirSync(outputDir, { recursive: true });

    exeTextFile(tfSpec.text, outputDir, tfSpec.fileName, tfSpec.mode);
}

/**
 * Obtains the important values from a 'textFileStep' input and returns them using an object.
 * @param {{name: "TEXT_FILE", type: "Action", args: [Object, Object, Object]}} tfStep 
 * @returns {{text: string, fileName: string, mode: string}}
 */
export function parseTextFile(tfStep) {
    assertStep(tfStep, "TEXT_FILE", "parseTextFile");
    const [textStep, fileStep, modeStep] = tfStep.args;

    const text = textStep.value;
    const fileName = fileStep.value;
    const mode = modeStep.selected.name;
    assertStep(textStep, "TEXT", "parseTextFile");
    assertStep(fileStep, "FILE_NAME", "parseTextFile");
    assertStep(modeStep, "OUTPUT_MODE", "parseTextFile");

    return { text: text, fileName: fileName, mode: mode };
}

/**
 * Saves (to) a text file based on the given text content and output mode.
 * @param {string} textContent The text content to write to the text file.
 * Any user variables will be resolved to their values.
 * @param {string} outputDir The directory to save the text file to.
 * @param {string} fileName File name (may include user variables).
 * @param {string} mode The output mode to use.
 */
export function exeTextFile(textContent, outputDir, fileName, mode) {
    const upMode = mode.toUpperCase();

    const resolvedContent = resolveString(textContent);
    const filePath = resolveTextFilePath(outputDir, fileName);

    switch (upMode) {
        case "WRITE":
            fs.writeFileSync(filePath, resolvedContent);
            break;

        case "APPEND":
            fs.appendFileSync(filePath, resolvedContent);
            break;

        default:
            throw new Error(`exeTextFile: unsupported output mode: ${upMode}`);
    }
}

/**
 * Resolves a file path from a given file name for a text file action.
 * If the file name does not have an extension, ".txt" will be appended.
 * @param {string} outputDir Base output directory.
 * @param {string} fileName File name (may include user variables).
 * @returns {string} Absolute resolved file path.
 * @throws {Error} If the file name is invalid.
 */
export function resolveTextFilePath(outputDir, fileName) {
    const resolvedName = resolveString(fileName).trim();

    // Strict filename: letters, numbers, underscore, dash, dot
    const filenameRegex = /^[a-z0-9][a-z0-9_.-]*$/i;

    if (!filenameRegex.test(resolvedName)) {
        throw new Error(
            `Invalid file name for text file: ${fileName} -> ${resolvedName}`
        );
    }

    // Disallow ".." to prevent traversal
    if (resolvedName.includes("..")) {
        throw new Error(
            `Invalid file name (path traversal not allowed): ${resolvedName}`
        );
    }

    let finalName = resolvedName;

    if (!finalName.toLowerCase().endsWith(".txt")) {
        finalName += ".txt";
    }

    return path.join(outputDir, finalName);
}