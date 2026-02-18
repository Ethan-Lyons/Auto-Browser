import { test, expect, describe } from '@jest/globals';

import { argumentStep, typeTextStep, delayStep as delayStep,
    textStep, findStep, canFindStep, blankStep, setFocusStep, skipStep } from '../../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab, exeUrlNav,
    canFind, find } from '../../WebHelpers/WebHelpers.js';

import { parseTypeText, exeTypeText, typeText, exeSetFocus } from '../../WebHelpers/WebHelpers.js';
import { parse } from 'path';

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
        const ttStep = typeTextStep(textStep("FOO"), delayStep("0"), skipStep());
        const ttSpec = parseTypeText(ttStep);
        expect(ttSpec).toEqual({ text: "FOO", delay: "0", setFocusStep: setFocusStep(skipStep()) });
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
        await exeSetFocus(locator);

        //await exeTypeText(locator, inputText, 0);
        await exeTypeText(context, inputText, 0);

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
        await exeSetFocus(locator);

        //await exeTypeText(locator, inputText, 0);
        //await exeTypeText(locator, inputText, 0);
        await exeTypeText(context, inputText, 0);
        await exeTypeText(context, inputText, 0);

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

        const ttStep = typeTextStep(textStep(inputText), delayStep("0"), fs);
        await typeText(context, ttStep);

        findResult = await canFind(context, cfStep);
        expect(findResult == true);
    });
});