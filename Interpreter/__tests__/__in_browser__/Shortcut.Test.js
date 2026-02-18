import { test, expect, describe } from '@jest/globals';
import { argumentStep, keyStep, shortcutStep, typeTextStep, delayStep,
    textStep, findStep, canFindStep, urlStep, modKeyStep, blankStep, waitNavStep, 
    trueStep, falseStep} from '../../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab, getActiveIndex, getTabs,
    getActivePage, exeUrlNav,  canFind, find} from '../../WebHelpers/WebHelpers.js';
import { exeKeyboard, exeCanFind, exeInfo, getTabCount,
    parseShortcut, exeShortcut } from '../../WebHelpers/WebHelpers.js';

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

describe('parseShortcut', () => {
    test('invalid key step', async () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() => parseShortcut(fakeStep)).toThrow();
    })

    test('valid key step', async () => {
        const scStep = shortcutStep(modKeyStep("Control"), keyStep("t"), waitNavStep(falseStep()));
        expect(parseShortcut(scStep)).toEqual({ modKeyStr: "Control", mainKey: "t", waitForNav: "FALSE" });
    });
});

describe('exeShortcut', () => {
    test('browser shortcut does nothing', async () => {
        /* Note: puppeteer cannot access browser level shortcuts */
        let tabCount = await getTabCount(context)
        expect (tabCount).toEqual(1);

        await exeKeyboard(context, shortcutStep(modKeyStep("Control"), keyStep("t"), waitNavStep(falseStep())));

        tabCount = await getTabCount(context);
        expect(tabCount).toEqual(1);
    });

    test('Enter navigation', async () => {
        await exeUrlNav(context, "https://www.scrapethissite.com/pages/forms/");
        
        // TODO: NEED TO FOCUS ELEMENT FIRST
        const fs = findStep(argumentStep('aria', '[role="textbox"]'));

        const scStep = shortcutStep(modKeyStep(""), keyStep("Enter"), waitNavStep(trueStep()));
        await exeKeyboard(context, scStep);

        const url = await exeInfo(context, "url")
        const expectedUrl = `https://www.scrapethissite.com/pages/forms/?q=`
        expect(url).toEqual(expectedUrl);
    });
});

describe('shortcut', () => {

})