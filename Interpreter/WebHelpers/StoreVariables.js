const variableStorage = new Map();
// TODO: create file ouput for variable similar to stack output
// clear file and overwrite if it exists
// update as needed (easiest to overwrite file each time?)
// also likely a method for clean output of a map which would simplify

/*this.stackLogPath = "stack.log";
    fs.writeFileSync(this.stackLogPath,
      "=== STACK TRACE START ===\n");

    this._logStack("INIT");

  _logStack(op, detail = "") {
  const snapshot = this._formatStack();
  fs.appendFileSync(
    this.stackLogPath,
    `[${op}] ${detail}\n` +
    `TOP → ${snapshot.join(" | ")}\n\n`
  );
  }

  _formatStack() {
    return this.stack
      .slice()
      .reverse()
      .map(s => s.selected?.name ?? s.name ?? "<unknown>");
  }*/

// Removes optional variable bracket markers
function normalizeVariableName(name) {
    const match = name.match(/^\{(.+)\}$/);
    if (match !== null) {
        return match[1];
    } else {
        return name;
    }
}

/**
 * Sets a value under a custom variable name.
 * @param {string} name - The variable name to store the value under.
 * @param {*} value - The value to store.
 */
export function setVariable(name, value) {
    const normalized = normalizeVariableName(name);
    variableStorage.set(normalized, value);
}

/**
 * Gets a value under a custom variable name.
 * @param {string} name - The variable name with the stored value.
 */
export function getVariableValue(name) {
    const normalized = normalizeVariableName(name);
    return variableStorage.get(normalized);
}

/**
 * Clears all stored variables.
 */
export function clearVariables() {
    variableStorage.clear();
}

// Replaces named variables inside brackets with their
// associated values in place to create a new string
export function resolveString(input) {
    if (typeof input !== 'string') {    // input is not a string
        try{
            input = String(input);       // try to convert to string
        }
        catch{
            throw new Error ('Invalid input for resolving string, ' +
                'type: ' + typeof input)
        }
    }

    const regex = /\{([^}]+)\}/g;   // matches characters between { and }

    /**
     * Helper function for resolving named variables inside a string.
     * If the variable exists in the variableStorage map, it will
     * replace the full match with the associated value as a string.
     * If the variable does not exist, it will return the full match
     * unchanged.
     * @param {string} fullMatch - The full match of the regex.
     * @param {string} variableName - The name of the variable to resolve.
     * @returns {string} The resolved string.
     */
    function replacer(fullMatch, variableName) {
        const exists = variableStorage.has(variableName);

        if (exists === false) { // variable does not exist
            return fullMatch;
        }

        const value = variableStorage.get(variableName);
        const valueAsString = String(value);    // convert value to string

        return valueAsString;
    }

    const result = input.replace(regex, replacer);  // replace named variables
    return result.trim();
}

export function resolveNumber(input) {
    if (typeof input == 'number') {
        return input;
    }
    else if (typeof input !== 'string') {
        throw new Error(`Cannot resolve input type to int. Type: ${typeof input}`);
    }

    const resolveVars = resolveString(input);
    const matchString = resolveVars.replaceAll(" ", "").replaceAll(",", "");

    const regex = /[0-9]+(\.[0-9]+)?/;
    const match = matchString.match(regex);

    if (!match) {
        throw new Error(`No numeric value found in "${input}"`);
    }

    return Number(match[0]);
}

export function resolveBoolean(input) {
    if (typeof input == 'boolean') {
        return input;
    }
    else if (typeof input !== 'string') {
        throw new Error(`Cannot resolve input type to boolean. Type: ${typeof input}`);
    }

    const resolveVars = resolveString(input);
    const matchString = resolveVars.replaceAll(" ", "")
                                   .replaceAll(",", "")
                                   .toLowerCase();

    const regex = /^(true|false)$/;
    const match = matchString.match(regex);

    if (!match) {
        throw new Error(`No boolean value found in "${input}"`);
    }

    return match[1] === "true";
}