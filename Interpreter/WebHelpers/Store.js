import { find, info } from './WebHelpers.js';
import * as Variables from './StoreVariables.js';


export async function store(context, storeAction) {
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
        await storeFind(context, selectedStep, endVar)
    }
    else if (selectedName == "info"){
        await storeInfo(context, selectedStep, endVar)
    }
    else {
        throw new Error ("Error: Unknown store type: " + selectedName);
    }
}

async function storeFind (context, findStep, endVarStep){
    const recieveName = endVarStep.value;
    const findReturn = await find(context, findStep)

    Variables.setVariable(recieveName, findReturn);
}

async function storeInfo (context, infoStep, endVarStep){
    const recieveName = endVarStep.value;
    const infoReturn = await info(context, infoStep)

    Variables.setVariable(recieveName, infoReturn);
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