import { test, expect, describe, beforeAll, beforeEach, afterEach, afterAll } from '@jest/globals';

import { argumentStep, keyStep, keyboardStep, shortcutStep, typeTextStep, delayStep,
    textStep, findStep, canFindStep, waitNavStep, falseStep, trueStep, modKeyStep,
    blankStep, skipStep, 
    setFocusStep} from '../../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab, exeUrlNav, canFind,
    parseKeyboard, exeKeyboard, keyboard, exeCanFind, exeInfo,
    getTabCount } from '../../WebHelpers/WebHelpers.js';

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

describe('parseKeyboard', () => {
    test('invalid key step', async () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() => parseKeyboard(fakeStep)).toThrow();
    })

    test('valid key step', async () => {
        const ks = keyboardStep(typeTextStep("example", "0", skipStep()));
        const result = parseKeyboard(ks);
        expect(result).toEqual({ modeStep: typeTextStep("example", "0", skipStep()) });
    });
});

describe('exeKeyboard', () => {
    test('mode: TYPE_TEXT', async () => {
        await exeUrlNav(context, "https://www.scrapethissite.com/pages/forms/");
        const inputText = "example";
        const cfStep = canFindStep(findStep(argumentStep("text", inputText)));
        let findResult = await canFind(context, cfStep);
        expect(findResult == false);

        const fs = findStep(argumentStep('aria', '[role="textbox"]'));
        const ttStep = typeTextStep(inputText, "0", fs);

        await exeKeyboard(context, ttStep);

        findResult = await canFind(context, cfStep);
        expect(findResult == true);
    });

    test('mode: SHORTCUT', async () => {
        let tabCount = await getTabCount(context)
        expect (tabCount).toEqual(1);

        const scStep = shortcutStep(modKeyStep("Control"), keyStep("t"), waitNavStep(falseStep()), skipStep());
        await exeKeyboard(context, scStep);

        tabCount = await getTabCount(context);
        expect(tabCount).toEqual(1);
    });

    test('combined, text enter', async () => {
        await exeUrlNav(context, "https://www.google.com");
        const inputText = "example";
        const fs = findStep(argumentStep('aria', '[role="combobox"]'));
        
        await exeKeyboard(context, typeTextStep(inputText, "0", fs));

        await exeKeyboard(context, shortcutStep(modKeyStep(""), keyStep("Enter"), waitNavStep(trueStep()), skipStep()));

        const url = await exeInfo(context, "url")
        const expectedUrl = `https://www.google.com/search?q=${inputText}`
        expect(url).toMatch(expectedUrl);
    });

    test('combined, backspace and arrows', async () => {
        await exeUrlNav(context, "https://www.scrapethissite.com/pages/forms/");

        const inputText = "example";
        const goalText = "exe test";
        expect(await exeCanFind(context, findStep(argumentStep("text", goalText))) == false);

        const fs = findStep(argumentStep('aria', '[role="textbox"]'));
        await exeKeyboard(context, typeTextStep(inputText, "0", fs));

        const leftStep = shortcutStep(modKeyStep("ArrowLeft"), keyStep(""), waitNavStep(falseStep()), skipStep());
        const rightStep = shortcutStep(modKeyStep("ArrowRight"), keyStep(""), waitNavStep(falseStep()), skipStep());
        const backStep = shortcutStep(modKeyStep("Backspace"), keyStep(""), waitNavStep(falseStep()), skipStep());
        await exeKeyboard(context, leftStep);
        await exeKeyboard(context, backStep);
        await exeKeyboard(context, backStep);
        await exeKeyboard(context, backStep);
        await exeKeyboard(context, backStep);
        await exeKeyboard(context, rightStep);

        await exeKeyboard(context, typeTextStep(goalText, "0", fs));
        const findResult = await exeCanFind(context, findStep(argumentStep("text", goalText)));
        expect(findResult == true);
    });

    test('combined, copy/paste', async () => {
        await exeUrlNav(context, "https://www.scrapethissite.com/pages/forms/");

        const inputText = "example";
        const goalText = "exampleexampleexample";
        let findResult = await exeCanFind(context, findStep(argumentStep("text", goalText)));
        expect(findResult == false);

        const fs = findStep(argumentStep('aria', '[role="textbox"]'));
        await exeKeyboard(context, typeTextStep(inputText, "0", fs));

        const selectStep = shortcutStep(modKeyStep("Control"), keyStep("A"), waitNavStep(falseStep()), skipStep());
        const copyStep = shortcutStep(modKeyStep("Control"), keyStep("C"), waitNavStep(falseStep()), skipStep());
        const pasteStep = shortcutStep(modKeyStep("Control"), keyStep("V"), waitNavStep(falseStep()), skipStep());
        await exeKeyboard(context, selectStep);
        await exeKeyboard(context, copyStep);

        await exeKeyboard(context, pasteStep);
        await exeKeyboard(context, pasteStep);
        await exeKeyboard(context, pasteStep);

        findResult = await exeCanFind(context, findStep(argumentStep("text", goalText)));
        expect(findResult == true);
    });
});

describe('keyboard', () => {
    test('keyboard mode: TYPE_TEXT', async () => {
        await exeUrlNav(context, "https://www.scrapethissite.com/pages/forms/");

        const goalText = "example";
        const subFocusStep = findStep(argumentStep('aria', '[role="textbox"]'));
        const ttStep = typeTextStep(goalText, "0", subFocusStep);
        const kbStep = keyboardStep(ttStep);

        await keyboard(context, kbStep);

        const findResult = await exeCanFind(context, findStep(argumentStep("text", goalText)));
        expect(findResult == true);
    });
})