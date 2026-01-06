const variableStorage = new Map()

export function setVariable(name, value) {
    variableStorage.set(name, value)
}

export function getVariableValue(name) {
    return variableStorage.get(name)
}

export function clearVariables() {
    for (const k in variableStorage) {
        delete variableStorage[k];
    }
}
