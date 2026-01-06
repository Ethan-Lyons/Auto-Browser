import { getActivePage } from './WebHelpers.js';
import * as Variables from './StoreVariables.js';
export async function store(storeAction) {
    /*    testVar = "Test Variable"
    testVal = "Value To Store"

    const variable = { name: "variable", value: testVar}    // The variable name to store under

    const textArg = { name: "text", value: testVal} // The text value to store
    const storableType = { name: "storable", selected: textArg}

    const storeAction = { name: "STORE", args: [storableType, variable]}*/

    const [storableType, storeVar] = storeAction.args;
    const selectedStep = storableType.selected;
    const sName = selectedStep.name.toLowerCase();

    if (sName == "text"){
        await storeText(selectedStep, storeVar)
    }
    else if (sName == "variable"){
        console.log("METHOD NOT IMPLEMENTED")
    }
    else if (sName == "find"){
        console.log("METHOD NOT IMPLEMENTED")
    }
    else if (sName == "info"){
        console.log("METHOD NOT IMPLEMENTED")
    }
}

async function storeText(textStep, storeVar){
    const storeValue = textStep.value
    const storeName = storeVar.value

    Variables.setVariable(storeName, storeValue)
}