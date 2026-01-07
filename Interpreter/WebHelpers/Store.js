import { getActivePage } from './WebHelpers.js';
import * as Variables from './StoreVariables.js';


export async function store(storeAction) {
    /*    testVar = "Test Variable"
    testVal = "Value To Store"

    const variable = { name: "variable", value: testVar}    // The variable name to store under

    const textArg = { name: "text", value: testVal} // The text value to store
    const storableType = { name: "storable", selected: textArg}

    const storeAction = { name: "STORE", args: [storableType, variable]}*/

    const [storableType, endVar] = storeAction.args;
    const selectedStep = storableType.selected;
    const selectedName = selectedStep.name.toLowerCase();

    if (selectedName == "text"){
        await storeText(selectedStep, endVar);
    }
    else if (selectedName == "variable"){
        await storeVar(selectedStep, endVar);
    }
    else if (selectedName == "find"){
        console.log("METHOD NOT IMPLEMENTED")
    }
    else if (selectedName == "info"){
        console.log("METHOD NOT IMPLEMENTED")
    }
}

async function storeVar(varStep, endVarStep){
    const sendingVar = varStep.value;
    const recieveName = endVarStep.value;

    const newVal = Variables.getVariableValue(sendingVar);

    Variables.setVariable(recieveName, newVal);
}

async function storeText(textStep, endVarStep){
    const newVal = textStep.value;
    const recieveName = endVarStep.value;

    Variables.setVariable(recieveName, newVal);
}