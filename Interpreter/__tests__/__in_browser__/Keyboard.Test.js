import { test, expect, describe } from '@jest/globals';
import { argumentStep, keyStep, keyboardStep, shortcutStep, typeTextStep,
    millisecondsStep, textStep, findStep, urlStep } from '../../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab,
    getActiveIndex, getTabs, getActivePage, exeUrlNav, 
    canFind} from '../../WebHelpers/WebHelpers.js';
import { parseKeyboard, exeKeyboard, keyboard, exeCanFind, exeInfo } from '../../WebHelpers/WebHelpers.js';

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

describe('parseKeyboard', () => {
    test('invalid key step', async () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() => parseKeyboard(fakeStep)).toThrow();
    })

    test('valid key step', async () => {
        
    });
});

describe('exeKeyboard', () => {
    test('mode: TYPE_TEXT', async () => {
        exeUrlNav(context, "https://www.scrapethissite.com/pages/forms/");
        const inputText = "example";
        expect(await exeCanFind(context, findStep(argumentStep("text", inputText))) == false);
        const keyStep = keyboardStep(typeTextStep(textStep(inputText), millisecondsStep("0")));
        await keyboard(context, keyStep);
        expect(await exeCanFind(context, findStep(argumentStep("text", inputText))) == true);
    });

    test('mode: shortcut', async () => {
        
    });

    test('combined', async () => {
        exeUrlNav(context, "https://www.scrapethissite.com/pages/forms/");
        const inputText = "example";
        const keyStep1 = keyboardStep(typeTextStep(textStep(inputText), millisecondsStep("0")));
        await keyboard(context, keyStep1);

        const keyStep2 = keyboardStep(shortcutStep("", "Enter"));
        await keyboard(context, keyStep2);
        expect(await exeInfo(context, "url")).toEqual(`https://www.scrapethissite.com/pages/forms/?q=${inputText}`);
    });
});