export function blankStep() {
    return { name: "BLANK", type: "Action", args: [null] };
}

export function argumentStep(name, value) {
    return { name: name, type: "Argument", value: value };
}

export function strictStep(selectedStrictStep) {
    return { name: "STRICT", type: "ActionGroup", selected: selectedStrictStep}
}

export function trueStep() {
    return { name: "TRUE", type: "Argument"}
}

export function falseStep() {
    return { name: "FALSE", type: "Argument"}
}

export function linkStep(text, selectedStrictStep) {
    return { name: "LINK", type: "Action", args: [textStep(text), strictStep(selectedStrictStep)] };
}

export function urlNavStep(urlVal) {
    return { name: "URL_NAV", type: "Action", args: [urlStep(urlVal)]};
}

export function urlStep(urlVal) {
    return argumentStep("url", urlVal)
}

export function findTextStep(selectedFindMode) {
    return { name: "FIND_TEXT", type: "Action", args: [findStep(selectedFindMode)] };
}

export function infoStep(selectedInfoStep) {
    return { name: "INFO", type: "ActionGroup", selected: selectedInfoStep };
}

export function waitStep(msVal) {
    const msStep = { name: "milliseconds", type: "Argument", value: msVal };
    return { name: "WAIT", type: "Action", args: [msStep] };
}

export function forStep(startVal, endVal) {
    const start = { name: "START", type: "Argument", value: startVal };
    const end = { name: "END", type: "Argument", value: endVal };
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

export function textStep(textVal) {
    return { name: "TEXT", type: "Argument", value: textVal };
}

export function screenShotStep(fileNameVal) {
    const file = { name: "FILE_NAME", type: "Argument", value: fileNameVal };
    return { name: "SCREENSHOT", type: "Action", args: [file] };
}

export function clickStep(findStep) {
    return { name: "CLICK", type: "Action", args: [findStep] };
}

export function historyStep(modeStep) {
    const historyMode = { name: "history_mode", type: "ActionGroup", selected: modeStep };
    return { name: "HISTORY", type: "Action", args: [historyMode] };
}

export function goForwardStep() {
    return { name: "GO_FORWARD", type: "Action", args: [null] };
}

export function goBackStep() {
    return { name: "GO_BACKWARD", type: "Action", args: [null] };
}

export function findStep(selectedStep) {
    return { name: "FIND", type: "ActionGroup", selected: selectedStep };
}

export function storeStep(modeName, modeVal, varName) {
    return { name: "STORE", type: "Action", args:
        [storableGroupStep(modeName, modeVal), variableStep(varName)] }
}

export function storableStep(modeName, modeVal) {
    return { name: modeName, value: modeVal}
}


export function storableGroupStep(modeName, modeVal) {
    return { name: "STORABLE", type: "ActionGroup", selected: storableStep(modeName, modeVal)}
}

export function variableStep(varName) {
    return { name: "VARIABLE", type: "Argument", value: varName}
}

export function newTabStep() {
    return { name: "NEW_TAB", type: "Action", args: [null] };
}

export function userAction(step) {
    return { name: "USER_ACTION", type: "ActionGroup", selected: step };
}