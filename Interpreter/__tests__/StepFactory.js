export function blankStep() {
    return { name: "BLANK", type: "Action", args: [null] };
}

export function waitStep(ms) {
    const msStep = { name: "milliseconds", type: "Argument", value: ms };
    return { name: "WAIT", type: "Action", args: [msStep] };
}

export function forStep(startIndex, endIndex) {
    const start = { name: "start", type: "Argument", value: startIndex };
    const end = { name: "end", type: "Argument", value: endIndex };
    return { name: "FOR", type: "Action", args: [start, end] };
}

export function endForStep() {
    return { name: "END_FOR", type: "Action", args: [null] };
}

export function ifStep(conditionStep) {
    return { name: "IF", type: "Action", args: [conditionStep] };
}

export function elseStep() {
    return { name: "ELSE", type: "Action", args: [null] };
}

export function whileStep(conditionStep) {
    return { name: "WHILE", type: "Action", args: [conditionStep] };
}

export function endIfStep() {
    return { name: "END_IF", type: "Action", args: [null] };
}

export function endWhileStep() {
    return { name: "END_WHILE", type: "Action", args: [null] };
}

export function conditionStep(selectedStep) {
    return { name: "CONDITION", type: "ActionGroup", selected: selectedStep };
}

export function canFindStep(findModeStep) {
    return { name: "CAN_FIND", type: "Action", args: [findStep(findModeStep)] };
}

export function textStep(text) {
    return { name: "text", type: "Argument", value: text };
}

export function screenShotStep(fileName) {
    const file = { name: "file_name", type: "Argument", value: fileName };
    return { name: "screenshot", type: "Action", args: [file] };
}

export function clickStep(findStep) {
    return { name: "CLICK", type: "Action", args: [findStep] };
}

export function historyStep(modeStep) {
    const historyMode = { name: "history_mode", type: "ActionGroup", selected: modeStep };
    return { name: "HISTORY", type: "Action", args: [historyMode] };
}

export function goForwardStep() {
    return { name: "go_forward", type: "Action", args: [null] };
}

export function goBackStep() {
    return { name: "go_backward", type: "Action", args: [null] };
}

export function findStep(selectedStep) {
    return { name: "FIND", type: "ActionGroup", selected: selectedStep };
}

export function storeStep(modeName, modeValue, varName) {
    return { name: "STORE", type: "Action", args:
        [storableGroup(modeName, modeValue), variable(varName)] }
}

export function storableStep(modeName, modeValue) {
    return { name: modeName, value: modeValue}
}

export function storableGroup(modeName, modeValue) {
    return { name: "storable", type: "ActionGroup", selected: storableStep(modeName, modeValue)}
}

export function variable(varName) {
    return { name: "variable", type: "Argument", value: varName}
}

export function newTab() {
    return { name: "NEW_TAB", type: "Action", args: [null] };
}

export function userAction(step) {
    return { name: "USER_ACTION", type: "ActionGroup", selected: step };
}