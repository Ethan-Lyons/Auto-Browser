import * as WebHelpers from '../WebHelpers/WebHelpers.js';
import { test, expect } from '@jest/globals';
import { urlStep, findStep, argumentStep, urlNavStep, newTabStep, blankStep, } from './StepFactory.js';
import { parseFind, exeFind, find } from '../WebHelpers/WebHelpers.js';

let browser;
let context;

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

describe("parseFind", () => {
    test("parseFind: invalid action", async () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() =>parseFind(fakeStep)).toThrow();
    });

    test("parseFind: valid action", async () => {
        const fStep = findStep(blankStep());
        const result = parseFind(fStep);
        expect(result).toEqual({ mode: "blank", step: blankStep() });
    });
});

describe("Find: find link", () => {
    test('Find Link: invalid', async () => {
        /*const textArg = { name: 'text', value: '$$$foobar&&&', type: 'argument' };

        const strictFalse = { name: 'false', value: 'false', type: 'argument' };
        const strictGroup = { name: 'strict', selected: strictFalse };

        const linkAction = { name: 'link', args: [textArg, strictGroup] };

        const findAction = { name: 'FIND', selected: linkAction };

        await WebHelpers.newTab(context);
        await WebHelpers.urlNav(context, navAction);
        const locator = await WebHelpers.find(context, findAction);
        await expect(locator.waitHandle()).rejects.toThrow();*/


    });

    test('Find Link: valid, strict = false', async () => {
        /*const textArg = { name: 'text', value: 'privacy' };

        const strictFalse = { name: 'false', value: 'false' };
        const strictGroup = { name: 'strict', selected: strictFalse };

        const linkAction = { name: 'link', args: [textArg, strictGroup] };

        const findAction = { name: 'FIND', selected: linkAction };

        await WebHelpers.newTab(context);
        await WebHelpers.urlNav(context, navAction);
        const locator = await WebHelpers.find(context, findAction);
        expect(await locator.waitHandle()).toBeDefined();*/


    });

    test('Find Link: valid, strict = true', async () => {
        /*const textArg = {
            name: 'text',
            value: 'https://policies.google.com/privacy?hl=en&fg=1'
        };

        const strictTrue = { name: 'true', value: 'true' };
        const strictGroup = { name: 'strict', selected: strictTrue };

        const linkAction = { name: 'link', args: [textArg, strictGroup] };

        const findAction = { name: 'FIND', selected: linkAction };

        await WebHelpers.newTab(context);
        await WebHelpers.urlNav(context, navAction);
        const locator = await WebHelpers.find(context, findAction);
        expect(await locator.waitHandle()).toBeDefined();*/


    });
});


describe("Find: xpath", () => {
    test('Find Xpath: invalid', async () => {
        
    });

    test('Find Xpath: valid', async () => {
        /*const xpath = {
            name: 'xpath',
            value: '//a[@href="https://policies.google.com/privacy?hl=en&fg=1"]'
        };

        const findAction = { name: 'FIND', selected: xpath };

        await WebHelpers.newTab(context);
        await WebHelpers.urlNav(context, navAction);
        const locator = await WebHelpers.find(context, findAction);
        expect(await locator.waitHandle()).toBeDefined();*/


    });
});

describe("Find: text", () => {
    test('Find Text: valid', async () => {
        /*const text = { name: 'text', value: 'Privacy' };

        const findAction = { name: 'FIND', selected: text };

        await WebHelpers.newTab(context);
        await WebHelpers.urlNav(context, navAction);
        const locator = await WebHelpers.find(context, findAction);
        expect(await locator.waitHandle()).toBeDefined();*/


    });
});

describe("Find: CSS", () => {
    test('Find CSS: valid', async () => {
       /* const css = { name: 'css', value: '*' };

        const findAction = { name: 'FIND', selected: css };

        await WebHelpers.newTab(context);
        await WebHelpers.urlNav(context, navAction);
        const locator = await WebHelpers.find(context, findAction);
        expect(await locator.waitHandle()).toBeDefined();*/
        

    });
});

describe("Find Aria", () => {
    test('Find Aria: valid', async () => {
        /*const aria = { name: 'aria', value: 'Privacy' };

        const findAction = { name: 'FIND', selected: aria };

        await WebHelpers.newTab(context);
        await WebHelpers.urlNav(context, navAction);
        const locator = await WebHelpers.find(context, findAction);
        expect(await locator.waitHandle()).toBeDefined();*/

    });
});






