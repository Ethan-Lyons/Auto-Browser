import * as WebHelpers from '../WebHelpers/WebHelpers.js'; 
import { test, expect } from '@jest/globals';

let browser;
let context;

/*
    npm run test:js -- --runTestsByPath Interpreter/__tests__/Store.Test.js
*/

beforeAll(async () => {
    try {
        browser = await WebHelpers.browserConnect();
    } catch (err) {
        console.error('Error connecting to Puppeteer:\n', err);
        process.exit(1);
    }
});

beforeEach(async () => {
    context = await WebHelpers.createNewContext(browser);
    WebHelpers.clearVariables()
});

afterEach(async () => {
    await context.close();
});

afterAll(async () => {
    await WebHelpers.browserDisconnect(browser);
});

test('Store Text Var', async () => {
    const testVar = "Test Variable";
    const testVal = "Value To Store";

    const variable = { name: "variable", value: testVar};    // The variable name to store under

    const textArg = { name: "text", value: testVal}; // The text value to store
    const storableType = { name: "storable", selected: textArg};

    const storeAction = { name: "STORE", args: [storableType, variable]};

    await WebHelpers.store(storeAction);

    const updatedVal = await WebHelpers.getVariableValue(testVar);
    expect(testVal).toEqual(updatedVal);
});

test('Store Var Var', async () => {
    const testVal = "Value To Store";
    const var1 = "var1";
    const var2 = "var2";

    // Create a text variable
    const variable1 = { name: "variable", value: var1};    // The variable name to store under
    const textArg1 = { name: "text", value: testVal}; // The text value to store
    const storableType1 = { name: "storable", selected: textArg1};
    const storeAction1 = { name: "STORE", args: [storableType1, variable1]};

    await WebHelpers.store(storeAction1);

    // Create new variable to transfer text value to
    const variable2 = { name: "variable", value: var2};    // The variable name to store under
    const variableArg = { name: "variable", value: var1}; // The name of the variable with the value to store
    const storableType2 = { name: "storable", selected: variableArg};
    const storeAction2 = { name: "STORE", args: [storableType2, variable2]};

    await WebHelpers.store(storeAction2);

    const v1Value = await WebHelpers.getVariableValue("var1");
    const v2Value = await WebHelpers.getVariableValue("var2");
    
    expect(v2Value).toEqual(v1Value);
    expect(v2Value).toEqual(testVal);
});

test('Store Find Var', async () => {
    const testVal = "Value To Store";
    const var1 = "var1";
    const var2 = "var2";

    // Create a text variable
    const variable1 = { name: "variable", value: var1};    // The variable name to store under
    const textArg1 = { name: "text", value: testVal}; // The text value to store
    const storableType1 = { name: "storable", selected: textArg1};
    const storeAction1 = { name: "STORE", args: [storableType1, variable1]};

    await WebHelpers.store(storeAction1);

    // Create new variable to transfer text value to
    const variable2 = { name: "variable", value: var2};    // The variable name to store under
    const variableArg = { name: "variable", value: var1}; // The name of the variable with the value to store
    const storableType2 = { name: "storable", selected: variableArg};
    const storeAction2 = { name: "STORE", args: [storableType2, variable2]};

    await WebHelpers.store(storeAction2);

    const v1Value = await WebHelpers.getVariableValue("var1");
    const v2Value = await WebHelpers.getVariableValue("var2");
    
    expect(v2Value).toEqual(v1Value);
    expect(v2Value).toEqual(testVal);
});