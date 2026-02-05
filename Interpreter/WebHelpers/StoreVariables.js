import fs from "fs";
import path from "path";

const variableStorage = new Map();
const logPath = path.join(process.cwd(), "variables.log");

// Initialize or clear the log file
fs.writeFileSync(logPath, "=== VARIABLE LOG START ===\n\n");

function logVariable(action, name, value) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(
        logPath,
        `[${timestamp}] [${action}] ${name} = ${JSON.stringify(value)}\n`
    );
}

// Removes optional variable bracket markers
function removeBrackets(name) {
    if (typeof name !== "string") return removeBrackets(String(name));
    const match = name.match(/^\{(.+)\}$/);
    return match ? match[1] : name;
}

/**
 * Sets a value under a custom variable name.
 */
export function setVariable(name, value) {
    const normalized = removeBrackets(name).toUpperCase();
    variableStorage.set(normalized, value);
    logVariable("SET", normalized, value);
}

/**
 * Gets a value under a custom variable name.
 * Throws if the variable is not defined.
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
 * Throws if a variable does not exist.
 */
export function resolveString(input) {
    if (input == null) throw new Error(`resolveString: input is null or undefined`);

    if (typeof input !== "string") {
        try {
            input = String(input);
        } catch {
            throw new Error(`resolveString: cannot convert input of type ${typeof input} to string`);
        }
    }
    input = input.trim().toUpperCase();
    const regex = /\{([^}]+)\}/g;

    function replacer(fullMatch, variableName) {

        if (!variableStorage.has(variableName)) {
            throw new Error(`resolveString: variable "${variableName}" not defined`);
        }
        const value = variableStorage.get(variableName);
        logVariable("RESOLVE", variableName, value);
        return String(value);
    }

    const result = input.replace(regex, replacer);
    return result.trim();
}

/**
 * Resolves a numeric input.
 * Throws if input is not a number or cannot be parsed.
 */
export function resolveNumber(input) {
    if (typeof input === "number") return input;
    if (input == null || typeof input !== "string") {
        throw new Error(`Cannot resolve input type to number. Type: ${typeof input}, Input: ${input}`);
    }

    const resolved = resolveString(input);
    const match = resolved.replace(/\s|,/g, "").match(/^[+-]?\d+(\.\d+)?$/);
    if (!match) throw new Error(`No numeric value found in "${input}"`);

    return Number(match[0]);
}

/**
 * Resolves a boolean input.
 * Throws if input is not a boolean or cannot be parsed.
 */
export function resolveBoolean(input) {
    if (typeof input === "boolean") return input;
    if (input == null || typeof input !== "string") {
        throw new Error(`Cannot resolve input type to boolean. Type: ${typeof input}, Input: ${input}`);
    }

    const resolved = resolveString(input);
    const normalized = resolved.replace(/[\s,]/g, "").toLowerCase();

    if (normalized !== "true" && normalized !== "false") {
        throw new Error(`No boolean value found in "${input}"`);
    }

    return normalized === "true";
}