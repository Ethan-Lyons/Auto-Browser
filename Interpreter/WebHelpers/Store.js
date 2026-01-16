import { find, findText, info } from './WebHelpers.js';
import * as Variables from './StoreVariables.js';

/**
 * Stores the result of an action under a new variable name.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @param {Object} storeAction A step object with two arguments,
 *  storableType: A step object with a single argument,
 *      the type of value to store.
 *   endVar: A step object with a single argument,
 *      the new variable name to store under.
 * @throws {Error} Error: Unknown store type if the type of
 *  storableType is unknown.
 */
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
    else if (selectedName == "find_text"){
        await storeFindText(context, selectedStep, endVar)
    }
    else if (selectedName == "info"){
        await storeInfo(context, selectedStep, endVar)
    }
    else {
        throw new Error ("Error: Unknown store type: " + selectedName);
    }
}

// TODO: convert to text find
async function storeFindText (context, findStep, endVarStep){
    const recieveName = endVarStep.value;
    const findReturn = await findText(context, findStep)

    Variables.setVariable(recieveName, findReturn);
}

/**
 * Stores the result of an info action under a new variable name.
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to use.
 * @param {Object} infoStep A step object with a single argument,
 *  the info action to store from.
 * @param {Object} endVarStep A step object with a single argument,
 *  the new variable name to store under.
 * @returns {Promise<void>} - A promise that resolves when the value
 *  has been stored under the new variable name.
 */
async function storeInfo (context, infoStep, endVarStep){
    const recieveName = endVarStep.value;
    const infoReturn = await info(context, infoStep)

    Variables.setVariable(recieveName, infoReturn);
}

/**
 * Stores the value of a variable under a (new) variable name.
 * @param {Object} varStep - A step object with a single argument,
 *  the variable name to store from.
 * @param {Object} endVarStep - A step object with a single argument,
 *  the new variable name to store under.
 * @returns {Promise<void>} - A promise that resolves when the value
 *  has been stored under the new variable name.
 */
async function storeVar(varStep, endVarStep){
    const sendingVar = varStep.value;
    const recieveName = endVarStep.value;

    const newVal = Variables.getVariableValue(sendingVar);

    Variables.setVariable(recieveName, newVal);
}

/**
 * Stores a user input text value under a (new) variable name.
 * @param {Object} textStep - A step object with a single argument,
 *  the text value to store from.
 * @param {Object} endVarStep - A step object with a single argument,
 *  the new variable name to store under.
 * @returns {Promise<void>} - A promise that resolves when the text
 *  value has been stored under the new variable name.
 */
async function storeText(textStep, endVarStep){
    const newVal = textStep.value;
    const recieveName = endVarStep.value;

    Variables.setVariable(recieveName, newVal);
}