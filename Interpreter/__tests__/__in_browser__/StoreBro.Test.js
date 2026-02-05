import { test, expect, describe } from '@jest/globals';
import { findTextStep, canFindStep, findStep, argumentStep, infoStep } from '../../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab,
    getActiveIndex, getTabs, getActivePage, exeUrlNav } from '../../WebHelpers/WebHelpers.js';
import { storeFindText, storeInfo, storeCanFind, getVariableValue } from '../../WebHelpers/WebHelpers.js';

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

        const ftStep = findTextStep(findStep(argumentStep("text", "Learn more")));
        await storeFindText(context, ftStep, varName);

        const storeResult = getVariableValue(varName);
        expect(storeResult).toEqual("Learn more");
    });

    test('storeFindText: partial match', async () => {
        const varName = "varName";
        await newTab(context);
        await exeUrlNav(context, "example.com");

        const ftStep = findTextStep(findStep(argumentStep("text", "Learn")));
        await storeFindText(context, ftStep, varName);

        const storeResult = getVariableValue(varName);
        expect(storeResult).toEqual("Learn more");
    });
});

describe('storeInfo', () => {
    test('storeInfo: url', async () => {
        await newTab(context);
        await exeUrlNav(context, "example.com");

        const iStep = infoStep(argumentStep("url", null));
        await storeInfo(context, iStep, "name");

        const storeResult = getVariableValue("name");
        expect(storeResult).toEqual("https://example.com/");
    });

    test('storeInfo: title', async () => {
        await newTab(context);
        await exeUrlNav(context, "example.com");

        const iStep = infoStep(argumentStep("title", null));
        await storeInfo(context, iStep, "name");

        const storeResult = getVariableValue("name");
        expect(storeResult).toEqual("Example Domain");
    });
});

describe('storeCanFind', () => {
    test('storeCanFind: true', async () => {
        await newTab(context);
        await exeUrlNav(context, "example.com");

        const cStep = canFindStep(findStep(argumentStep("text", "Learn more")));
        await storeCanFind(context, cStep, "canFind");

        const storeResult = getVariableValue("canFind");
        expect(storeResult).toEqual(true);
    });

    test('storeCanFind: partial match true', async () => {
        await newTab(context);
        await exeUrlNav(context, "example.com");

        const cStep = canFindStep(findStep(argumentStep("text", "Learn")));
        await storeCanFind(context, cStep, "canFind");

        const storeResult = getVariableValue("canFind");
        expect(storeResult).toEqual(true);
    });

    test('storeCanFind: false', async () => {
        await newTab(context);
        await exeUrlNav(context, "example.com");

        const cStep = canFindStep(findStep(argumentStep("text", "foobar")));
        await storeCanFind(context, cStep, "canFind");

        const storeResult = getVariableValue("canFind");
        expect(storeResult).toEqual(false);
    });
});

