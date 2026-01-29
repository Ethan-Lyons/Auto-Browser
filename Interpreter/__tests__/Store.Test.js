import * as WebHelpers from '../WebHelpers/WebHelpers.js'; 
import { test, expect } from '@jest/globals';

let browser;
let context;
let page;

beforeAll(async () => {
    try {
        browser = await WebHelpers.getBrowser();
    } catch (err) {
        console.error('Error connecting to Puppeteer:\n', err);
        process.exit(1);
    }
});

beforeEach(async () => {
    context = await WebHelpers.getContext(browser, true);
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

test('Store Find Var', async () => {
    const expected = 'Privacy';
    const storeName = 'TestVar';

    const url = { name: 'url', value: 'google.com' };
    const navAction = { name: 'URL_NAV', args: [url] };

    const variable = { name: 'variable', value: storeName };

    const text = { name: 'text', value: expected };

    const findAction = { name: 'find', selected: text };
    const findText = { name: 'find_text', args: [findAction] };

    const storable = { name: 'storable', selected: findText };
    const storeStep = { name: 'STORE', args: [storable, variable] };

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    await WebHelpers.store(context, storeStep);

    let recieved = await WebHelpers.getVariableValue(storeName);

    expect(recieved).toBeDefined();
    expect(recieved).toEqual(expected);
});

test('Store Info Var URL', async () => {
    const storeName = 'TestVar';
    const target = 'google.com';

    const url = { name: 'url', value: target };
    const navAction = { name: 'URL_NAV', args: [url] };

    const variable = { name: 'variable', value: storeName };

    const urlArg = { name: 'url', value: null };
    const infoStep = { name: 'info', selected: urlArg };

    const storable = { name: 'storable', selected: infoStep };
    const storeStep = { name: 'STORE', args: [storable, variable] };

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    await WebHelpers.store(context, storeStep);

    const recieved = await WebHelpers.getVariableValue(storeName);

    expect(recieved).toBeDefined();
    expect(recieved).toMatch(target);
});