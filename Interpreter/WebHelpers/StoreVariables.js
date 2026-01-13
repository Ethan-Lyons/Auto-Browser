const variableStorage = new Map();

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

export function resolveString(input) {
    if (typeof input !== 'string') {
        return input;
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
    const resolveVars = resolveString(input)

    const matchString = resolveVars.replaceAll(" ", "").replaceAll(",", "")    // Remove commas and spaces

    const regex = /[0-9]+([.][0-9]+)?/;
    const match = regex.match(matchString)[0];  // Match integer and decimal numbers

    return Number(match);
}

export function resolveBoolean(input) {
    if (typeof input !== 'string') {
        return input;
    }
    const resolveVars = resolveString(input)

    const matchString = resolveVars.replaceAll(" ", "")         // Remove commas, spaces,
                            .replaceAll(",", "").toLowerCase()  // and lower case

    const regex = /\s*(true|false)\s*/i;
    const match = regex.match(matchString)[0];  // Match boolean strings

    return Number(match);
}