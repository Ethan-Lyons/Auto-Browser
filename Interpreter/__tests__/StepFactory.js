export function blankStep() {
    return { name: "BLANK", type: "Action", args: [null] };
}

export function argumentStep(name, value) {
    return { name: name, type: "Argument", value: value };
}

export function strictStep(selectedStrictStep) {
    return { name: name, type: "ActionGroup", selected: selectedStrictStep}
}

export function trueStep() {
    return argumentStep("true", "true")
}

export function falseStep() {
    return argumentStep("false", "false")
}

export function falseStep() {

}

export function urlNavStep(targetURL) {
    return { name: "URL_NAV", type: "Action", args: [urlStep(targetURL)]};
}

export function urlStep(targetURL) {
    return argumentStep("url", targetURL)
}

export function findTextStep(selectedFindMode) {
    return { name: "FIND_TEXT", type: "Action", args: [findStep(selectedFindMode)] };
}

export function infoStep(selectedInfoStep) {
    return { name: "INFO", type: "ActionGroup", selected: selectedInfoStep };
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
        [storableGroupStep(modeName, modeValue), variableStep(varName)] }
}

export function storableStep(modeName, modeValue) {
    return { name: modeName, value: modeValue}
}


export function storableGroupStep(modeName, modeValue) {
    return { name: "storable", type: "ActionGroup", selected: storableStep(modeName, modeValue)}
}

export function variableStep(varName) {
    return { name: "variable", type: "Argument", value: varName}
}

export function newTabStep() {
    return { name: "NEW_TAB", type: "Action", args: [null] };
}

export function userAction(step) {
    return { name: "USER_ACTION", type: "ActionGroup", selected: step };
}