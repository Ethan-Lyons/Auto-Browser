export function createStoreStep(modeName, modeValue, varName) {
    return { name: "STORE", type: "Action", args:
        [createStorableGroup(modeName, modeValue), createVariableStep(varName)] }
}

export function createStorableStep(modeName, modeValue) {
    return { name: modeName, value: modeValue}
}

export function createStorableGroup(modeName, modeValue) {
    return { name: "storable", type: "ActionGroup", selected: createStorableStep(modeName, modeValue)}
}

export function createVariableStep(varName) {
    return { name: "variable", type: "Argument", value: varName}
}

function createForStep(start, end) {
    return { name: "FOR", type: "Action", args:
        [{ value: start, type: "argument" }, { value: end, type: "argument" }] };
}

function createNewTabStep() {
    return { name: "NEW_TAB", type: "Action", args: [null] };
}

export function userAction(step) {
    return { name: "USER_ACTION", type: "ActionGroup", selected: step };
}