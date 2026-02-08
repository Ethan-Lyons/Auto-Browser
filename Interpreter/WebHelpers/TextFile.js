import { resolveString } from './WebHelpers.js';
import { BrowserContext} from 'puppeteer-core';
import fs from 'fs';

/**
 * Parses and executes a text file output action.
 * @param {BrowserContext} context 
 * @param {{ name: "TEXT_FILE", type: "Action", args: [Object, Object, Object] }} tfStep An object
 * containing the information for the text file action.
 * @param {String} outputDir The directory to save the text file to.
 */
export function textFile(tfStep, outputDir) {
    const tfSpec = parseTextFile(tfStep);
    exeTextFile(tfSpec.text, tfSpec.fileName, outputDir, tfSpec.mode);
}

/**
 * Obtains the important values from a 'textFileStep' input and returns them using an object.
 * @param {{ name: "TEXT_FILE", type: "Action", args: [Object, Object, Object] }} tfStep 
 * @returns {{ text: String, fileName: String, mode: String }}
 */
export function parseTextFile(tfStep) {
    const [textStep, fileStep, modeStep] = tfStep.args;

    const text = textStep.value;
    const fileName = fileStep.value;
    const mode = modeStep.selected.name;

    return { text: text, fileName: fileName, mode: mode };
}

/**
 * Saves (to) a text file based on the given text content and output mode.
 * @param {String} textContent The text content to write to the text file.
 * @param {String} outputDir The directory to save the text file to.
 * @param {String} mode The output mode to use.
 */
export function exeTextFile(textContent, fileName, outputDir, mode) {
    mode = mode.toUpperCase();
    const filePath = resolveFilePath(fileName, outputDir);

    switch (mode) {
        case "WRITE":
            fs.writeFileSync(filePath, textContent);
        case "APPEND":
            fs.appendFileSync(filePath, textContent);
        default:
            throw new Error(`exeTextFile: unsupported output mode: ${mode}`);
    }
}

/**
 * Resolves a file path from a given file name for a text file action.
 * If the file name does not have an extension, it will be added as ".txt".
 * @param {String} fileName The file name to resolve the file path from.
 * @returns {String} The resolved file path.
 * @throws {Error} If the file name is invalid.
 */
function resolveFilePath(fileName, outputDir) {
    fileName = resolveString(fileName);

    const regex = /^([a-zA-Z0-9_.-])+(\.(txt))?$/i;
    const match = fileName.match(regex);
    if (!match) {
        throw new Error(`Invalid file name for text file: ${fileName}`);
    }

    let outName = match[0];
    const extension = match[2];
    if (!extension) {
        outName += ".txt";
    }

    outName = outputDir + outName;

    return outName;
}