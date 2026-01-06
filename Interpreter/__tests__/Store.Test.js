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
    testVar = "Test Variable"
    testVal = "Value To Store"

    const variable = { name: "variable", value: testVar}    // The variable name to store under

    const textArg = { name: "text", value: testVal} // The text value to store
    const storableType = { name: "storable", selected: textArg}

    const storeAction = { name: "STORE", args: [storableType, variable]}

    await WebHelpers.store(storeAction)

    updatedVal = await WebHelpers.getVariableValue(testVar)
    expect(testVal).toEqual(updatedVal)
});