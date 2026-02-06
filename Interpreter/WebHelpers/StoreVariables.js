import fs from "fs";
import path from "path";

const variableStorage = new Map();
const logPath = path.join(process.cwd(), "variables.log");

// Initialize or clear the log file
fs.writeFileSync(logPath, "=== VARIABLE LOG START ===\n\n");

/**
 * Updates the variable log file.
 * @param {String} action The action that triggered the log.
 * @param {String} name The variable name.
 * @param {String} value The variable value.
 */
function logVariable(action, name, value) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(
        logPath,
        `[${timestamp}] [${action}] ${name} = ${JSON.stringify(value)}\n`
    );
}

/**
 * 
 * @param {String} name 
 * @returns {String}
 */
function removeBrackets(name) {
    if (typeof name !== "string") return removeBrackets(String(name));
    const match = name.match(/^\{(.+)\}$/);
    return match ? match[1] : name;
}

/**
 * 
 * @param {String} name The name of the variable to set, with or without brackets.
 * @param {String} value The value to set the variable to.
 */
export function setVariable(name, value) {
    const normalized = removeBrackets(name).toUpperCase();
    variableStorage.set(normalized, value);
    logVariable("SET", normalized, value);
}

/**
 *  Gets a value under a custom variable name.
 *  @param {String} name The name of the variable to get from, with or without brackets.
 *  @throws If the variable has not been defined.
 *  @returns {String} The value of the variable.
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
 *  Replaces named variables inside brackets with their values.
 *  Throws if a variable does not exist.
 *  @param {*} input
 *  @returns {String} The resolved string.
 */
export function resolveString(input) {
    if (typeof input !== "string") {
        try {
            input = String(input);
            return resolveString(input);
        } catch {
            throw new Error(`Cannot resolve input type to string.
                Type: ${typeof input}, Input: ${input}`);
        }
    }
    input = input.trim().toUpperCase();

    function replacer(fullMatch, variableName) {

        if (!variableStorage.has(variableName)) {
            throw new Error(`resolveString: variable "${variableName}" not defined`);
        }
        const value = variableStorage.get(variableName);
        logVariable("RESOLVE", variableName, value);
        return String(value);
    }

    const regex = /\{([^}]+)\}/g;
    const result = input.replace(regex, replacer);
    return result.trim();
}

/**
 *  Resolves a numeric input.
 *  Throws if input is not a number or cannot be parsed.
 *  @param {String|Number} input 
 *  @returns {Number}
 */
export function resolveNumber(input) {
    // Return number values directly, otherwise ensure input is a string.
    if (typeof input === "number") return input;
    else if (typeof input !== "string") {
        throw new Error(`Cannot resolve input type to number.
            Type: ${typeof input}, Input: ${input}`);
    }

    // Resolves named variables and ensure formatting.
    const resolved = resolveString(input);
    const normalized = resolved.replace(/[\s,$%~]/g, "");

    const matchResult = normalized.match(/^[+-]?\d+(\.\d+)?$/);
    if (!matchResult) throw new Error(`No numeric value found in "${input}"`);

    return Number(matchResult[0]);
}

/**
 *  Resolves a boolean input.
 *  Throws if input is not a boolean or cannot be parsed.
 *  @param {String|Boolean} input 
 *  @returns {Boolean}
 */
export function resolveBoolean(input) {
    // Return boolean values directly, otherwise ensure input is a string.
    if (typeof input === "boolean") return input;
    else if (typeof input !== "string") {
        throw new Error(`Cannot resolve input type to boolean.
            Type: ${typeof input}, Input: ${input}`);
    }

    // Resolves named variables and ensure formatting.
    const resolved = resolveString(input);
    const normalized = resolved.trim().toLowerCase();

    if (normalized !== "true" && normalized !== "false") {
        throw new Error(`Boolean value not found. Input: "${input}"`);
    }

    return normalized === "true";
}