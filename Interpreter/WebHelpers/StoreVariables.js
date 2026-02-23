import fs from "fs";
import path from "path";

const variableStorage = new Map();
const logPath = path.join(process.cwd(), "variables.log");

// Initialize or clear the log file
fs.writeFileSync(logPath, "=== VARIABLE LOG START ===\n\n");

/**
 * Updates the variable log file.
 * @param {string} action The action that triggered the log.
 * @param {string} name The variable name.
 * @param {string} value The variable value.
 */
function logVariable(action, name, value) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(
        logPath,
        `[${timestamp}] [${action}] ${name} = ${JSON.stringify(value)}\n`
    );
}

/**
 * Removes optional brackets from the start and end of a string.
 * @param {string} inputStr The string to remove brackets from.
 * @returns {string}
 */
function removeBrackets(inputStr) {
    if (typeof inputStr !== "string") return removeBrackets(String(inputStr));
    const match = inputStr.match(/^\{(.+)\}$/);
    return match ? match[1] : inputStr;
}

/**
 * Sets a value under a custom variable name.
 * @param {string} name The name of the variable to set, with or without brackets.
 * @param {string} value The value to set the variable to.
 */
export function setVariable(name, value) {
    const formatName = removeBrackets(name).toUpperCase();
    variableStorage.set(formatName, value);
    logVariable("SET", formatName, value);
}

/**
 *  Gets a value under a custom variable name.
 *  @param {string} name The name of the variable to get from, with or without brackets.
 *  @throws If the variable has not been defined.
 *  @returns {string} The value of the variable.
 */
export function getVariableValue(name) {
    const targetVar = removeBrackets(name).toUpperCase();
    if (!variableStorage.has(targetVar)) {
        throw new Error(`Variable "${targetVar}" is not defined`);
    }

    const value = variableStorage.get(targetVar);
    logVariable("GET", targetVar, value);
    return value;
}

/**
 * Clears all stored variables.
 */
export function clearVariables() {
    variableStorage.clear();
    fs.appendFileSync(logPath, `\n=== VARIABLES CLEARED ===\n\n`);
}

/**
 * Replaces named variables inside brackets with their values.
 * @param {*} input An input, likely a string, that may contain named variables.
 * @returns {string} The resolved string.
 * @throws If the input cannot be converted to a string.
 */
export function resolveString(input) {
    if (typeof input !== "string") {
        try {
            return resolveString(String(input));
        } catch {
            throw new Error(
                `Cannot resolve input type to string. Type: ${typeof input}, Input: ${input}`
            );
        }
    }

    const trimmed = input.trim();

    /**
     * Replacer function for resolving named variables inside a string.
     * @param {string} fullMatch The full match of the regex, including the
     *  variable name inside brackets.
     * @param {string} variableName The name of the variable to resolve, without
     *  brackets.
     * @throws If the variable is named but does not exist.
     * @returns {string} The resolved string.
     */
    function replacer(fullMatch, variableName) {
        const normalized = variableName.trim().toUpperCase();

        if (!variableStorage.has(normalized)) {
            throw new Error(`resolveString: variable "${variableName}" not defined`);
        }

        const value = variableStorage.get(normalized);
        logVariable("RESOLVE", normalized, value);
        return String(value);
    }

    const regex = /\{([^}]+)\}/g;   // Matches with characters (excluding '}') inside brackets
    return trimmed.replace(regex, replacer).trim();
}

/**
 *  Resolves a numeric input.
 *  Throws if input is not a number or cannot be parsed.
 *  @param {string|Number} input 
 *  @returns {Number}
 */
export function resolveNumber(input) {
    // Return number values directly, otherwise ensure input is a string.
    if (typeof input === "number") return input;

    else if (typeof input === "string") {
        // Resolves named variables and ensure formatting.
        const resolved = resolveString(input);
        const normalized = resolved.replace(/[\s,$%~]/g, "");

        const matchResult = normalized.match(/^[+-]?\d+(\.\d+)?$/);
        if (!matchResult) throw new Error(`No numeric value found in "${input}"`);

        return Number(matchResult[0]);

    } else {
        throw new Error(`Cannot resolve input type to number.
            Type: ${typeof input}, Input: ${JSON.stringify(input)}`);
    }
}

/**
 *  Resolves a boolean input.
 *  Throws if input is not a boolean or cannot be parsed.
 *  @param {string|Boolean} input 
 *  @returns {Boolean}
 */
export function resolveBoolean(input) {
    // Return boolean values directly, otherwise ensure input is a string.
    if (typeof input === "boolean") return input;

    else if (typeof input === "string") {
        // Resolves named variables and ensure formatting.
        const resolved = resolveString(input);
        const normalized = resolved.trim().toLowerCase();

        if (normalized === "true") return true;
        else if (normalized === "false") return false;
        else throw new Error(`No boolean value found in string: "${input}"`);
    }

    else {
        throw new Error(`Cannot resolve input type to boolean.
            Type: ${typeof input}, Input: ${input}`);
    }
}