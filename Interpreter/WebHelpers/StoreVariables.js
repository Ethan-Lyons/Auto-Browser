const variableStorage = new Map();

// Removes optional variable bracket markers
function normalizeVariableName(name) {
    const match = name.match(/^\{(.+)\}$/);
    if (match !== null) {
        return match[1];
    } else {
        return name;
    }
}

export function setVariable(name, value) {
    const normalized = normalizeVariableName(name);
    variableStorage.set(normalized, value);
}

export function getVariableValue(name) {
    const normalized = normalizeVariableName(name);
    return variableStorage.get(normalized);
}

export function clearVariables() {
    variableStorage.clear();
}

// Replaces named variables inside brackets with their
// associated values in place to create a new string
export function resolveString(input) {
    if (typeof input !== 'string') {
        try{
            return String(input)
        }
        catch{
            throw new Error ("Invalid input for resolving string, type: " + typeof input)
        }
    }

    const regex = /\{([^}]+)\}/g;

    function replacer(fullMatch, variableName) {
        const exists = variableStorage.has(variableName);

        if (exists === false) {
            return fullMatch;
        }

        const value = variableStorage.get(variableName);
        const valueAsString = String(value);

        return valueAsString;
    }

    const result = input.replace(regex, replacer);
    return result.trim();
}

export function resolveNumber(input) {
    if (typeof input !== 'string') {
        return input;
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
    if (typeof input !== 'string') {
        return input;
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