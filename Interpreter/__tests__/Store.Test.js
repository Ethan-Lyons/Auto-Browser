import * as WebHelpers from '../WebHelpers/WebHelpers.js';
import { test, expect } from '@jest/globals';

/*
    npm run test:js -- --runTestsByPath Interpreter/__tests__/Store.Test.js
*/

let browser;
let context;

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
    WebHelpers.clearVariables();
});

afterEach(async () => {
    await context.close();
});

afterAll(async () => {
    await WebHelpers.browserDisconnect(browser);
});

test('Store Text Var', async () => {
    const testVar = 'Test Variable';
    const testVal = 'Value To Store';

    const variable = { name: 'variable', value: testVar };

    const textArg = { name: 'text', value: testVal };
    const storableType = { name: 'storable', selected: textArg };

    const storeAction = {
        name: 'STORE',
        args: [storableType, variable]
    };

    await WebHelpers.store(context, storeAction);

    const updatedVal = await WebHelpers.getVariableValue(testVar);
    expect(updatedVal).toEqual(testVal);
});

test('Store Var Var', async () => {
    const testVal = 'Value To Store';
    const var1 = 'var1';
    const var2 = 'var2';

    const variable1 = { name: 'variable', value: var1 };
    const textArg1 = { name: 'text', value: testVal };
    const storableType1 = { name: 'storable', selected: textArg1 };
    const storeAction1 = { name: 'STORE', args: [storableType1, variable1] };

    await WebHelpers.store(context, storeAction1);

    const variable2 = { name: 'variable', value: var2 };
    const variableArg = { name: 'variable', value: var1 };
    const storableType2 = { name: 'storable', selected: variableArg };
    const storeAction2 = { name: 'STORE', args: [storableType2, variable2] };

    await WebHelpers.store(context, storeAction2);

    const v1Value = await WebHelpers.getVariableValue(var1);
    const v2Value = await WebHelpers.getVariableValue(var2);

    expect(v2Value).toEqual(v1Value);
    expect(v2Value).toEqual(testVal);
});

test('Store Find Var', async () => {
    const storeName = 'TestVar';

    const url = { value: 'google.com' };
    const navAction = { name: 'URL_NAV', args: [url] };

    const variable = { name: 'variable', value: storeName };

    const text = { name: 'text', value: 'Privacy' };

    const findAction = {
        name: 'FIND',
        selected: text
    };

    const storable = { name: 'storable', selected: findAction };
    const storeStep = { name: 'STORE', args: [storable, variable] };

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    await WebHelpers.store(context, storeStep);

    let recieved = await WebHelpers.getVariableValue(storeName);
    recieved = await recieved.waitHandle();

    let expected = await WebHelpers.find(context, findAction);
    expected = await expected.waitHandle();

    expect(recieved).toBeDefined();
    expect(recieved).toEqual(expected);
});

test('Store Info Var URL', async () => {
    const storeName = 'TestVar';
    const target = 'google.com';

    const url = { value: target };
    const navAction = { name: 'URL_NAV', args: [url] };

    const variable = { name: 'variable', value: storeName };

    const urlArg = { name: 'url', value: null };
    const infoSelect = { name: 'info_select', selected: urlArg };
    const infoAction = { name: 'INFO', args: [infoSelect] };

    const storable = { name: 'storable', selected: infoAction };
    const storeStep = { name: 'STORE', args: [storable, variable] };

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    await WebHelpers.store(context, storeStep);

    const recieved = await WebHelpers.getVariableValue(storeName);

    expect(recieved).toBeDefined();
    expect(recieved).toMatch(target);
});