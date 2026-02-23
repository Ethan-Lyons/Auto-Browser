import { test, expect, describe, beforeAll, beforeEach, afterEach, afterAll } from '@jest/globals';

import { findTextStep, canFindStep, findStep, argumentStep, infoStep } from '../../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab, exeUrlNav, exeStore,
    getVariableValue } from '../../WebHelpers/WebHelpers.js';

let browser;
let context;

beforeAll(async () => {
    try {
        browser = await getBrowser();
    } catch (err) {
        console.error('Error connecting to Puppeteer:\n', err);
        process.exit(1);
    }
});

beforeEach(async () => {
    context = await getContext(browser, true);
});

afterEach(async () => {
    await context.close();
});

afterAll(async () => {
    await browserDisconnect(browser);
});

describe('storeFindText', () => {
    test('storeFindText: full match', async () => {
        const varName = "varName";
        await newTab(context);
        await exeUrlNav(context, "example.com");

        const textToFind = "Learn more";
        const ftStep = findTextStep(findStep(argumentStep("text", textToFind)));
        await exeStore(context, "FIND_TEXT", ftStep, varName);

        const storeResult = getVariableValue(varName);
        expect(storeResult).toEqual("Learn more");
    });

    test('storeFindText: partial match', async () => {
        const varName = "varName";
        await newTab(context);
        await exeUrlNav(context, "example.com");

        const textToFind = "Learn";
        const ftStep = findTextStep(findStep(argumentStep("text", textToFind)));
        await exeStore(context, "FIND_TEXT", ftStep, varName);

        const storeResult = getVariableValue(varName);
        expect(storeResult).toEqual("Learn more");
    });
});

describe('storeInfo', () => {
    test('storeInfo: url', async () => {
        const varName = "varName";
        await newTab(context);
        await exeUrlNav(context, "example.com");

        const iStep = infoStep(argumentStep("url", null));
        await exeStore(context, "INFO", iStep, varName);

        const storeResult = getVariableValue(varName);
        expect(storeResult).toEqual("https://example.com/");
    });

    test('storeInfo: title', async () => {
        const varName = "varName";
        await newTab(context);
        await exeUrlNav(context, "example.com");

        const iStep = infoStep(argumentStep("title", null));
        await exeStore(context, "INFO", iStep, varName);

        const storeResult = getVariableValue(varName);
        expect(storeResult).toEqual("Example Domain");
    });
});

describe('storeCanFind', () => {
    test('storeCanFind: true', async () => {
        const varName = "varName";
        await newTab(context);
        await exeUrlNav(context, "example.com");

        const textToFind = "Learn more";
        const cStep = canFindStep(findStep(argumentStep("text", textToFind)));
        await exeStore(context, "CAN_FIND", cStep, varName);

        const storeResult = getVariableValue(varName);
        expect(storeResult).toEqual("true");
    });

    test('storeCanFind: partial match true', async () => {
        const varName = "varName";
        await newTab(context);
        await exeUrlNav(context, "example.com");

        const textToFind = "Learn";
        const cStep = canFindStep(findStep(argumentStep("text", textToFind)));
        await exeStore(context, "CAN_FIND", cStep, varName);

        const storeResult = getVariableValue(varName);
        expect(storeResult).toEqual("true");
    });

    test('storeCanFind: false', async () => {
        const varName = "varName";
        await newTab(context);
        await exeUrlNav(context, "example.com");

        const textToFind = "foobar";
        const cStep = canFindStep(findStep(argumentStep("text", textToFind)));
        await exeStore(context, "CAN_FIND", cStep, varName);

        const storeResult = getVariableValue(varName);
        expect(storeResult).toEqual("false");
    });
});

