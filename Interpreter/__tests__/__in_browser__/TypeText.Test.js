import { test, expect, describe } from '@jest/globals';
import { argumentStep, typeTextStep, millisecondsStep,
    textStep, findStep, canFindStep, urlStep, modKeyStep, blankStep, waitNavStep } from '../../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab, getActiveIndex, getTabs,
    getActivePage, exeUrlNav, canFind, find } from '../../WebHelpers/WebHelpers.js';
import { parseTypeText, exeTypeText, typeText } from '../../WebHelpers/WebHelpers.js';

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
    await newTab(context);
});

afterEach(async () => {
    await context.close();
});

afterAll(async () => {
    await browserDisconnect(browser);
});

describe('parseTypeText', () => {
    test('invalid key step', async () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() => parseTypeText(fakeStep)).toThrow();
    })

    test('valid key step', async () => {
        const ttStep = typeTextStep(blankStep(), textStep("FOO"), millisecondsStep("0"));
        expect(parseTypeText(ttStep)).toEqual({ findStep: blankStep(), text: "FOO", delay: "0" });
    });
});

describe('exeTypeText', () => {
    test('type text single', async () => {
        await exeUrlNav(context, "https://www.scrapethissite.com/pages/forms/");
        const inputText = "example";

        const cfStep = canFindStep(findStep(argumentStep("text", inputText)));

        let findResult = await canFind(context, cfStep);
        expect(findResult == false);

        const fs = findStep(argumentStep('aria', '[role="textbox"]'));
        const locator = await find(context, fs);

        await exeTypeText(locator, inputText, 0);

        findResult = await canFind(context, cfStep);
        expect(findResult == true);
    });

    test('type text multiple', async () => {
        await exeUrlNav(context, "https://www.scrapethissite.com/pages/forms/");
        const inputText = "example";
        const expectedText = inputText + inputText;

        const cfStep = canFindStep(findStep(argumentStep("text", expectedText)));

        let findResult = await canFind(context, cfStep);
        expect(findResult == false);

        const fs = findStep(argumentStep('aria', '[role="textbox"]'));
        const locator = await find(context, fs);

        await exeTypeText(locator, inputText, 0);
        await exeTypeText(locator, inputText, 0);

        findResult = await canFind(context, cfStep);
        expect(findResult == true);
    });
});

describe('typeText', () => {
    test('type text single', async () => {
        await exeUrlNav(context, "https://www.scrapethissite.com/pages/forms/");
        const inputText = "example";

        const cfStep = canFindStep(findStep(argumentStep("text", inputText)));

        let findResult = await canFind(context, cfStep);
        expect(findResult == false);

        const fs = findStep(argumentStep('aria', '[role="textbox"]'));
        const locator = await find(context, fs);

        await typeText(locator, inputText, 0);

        findResult = await canFind(context, cfStep);
        expect(findResult == true);
    });
});