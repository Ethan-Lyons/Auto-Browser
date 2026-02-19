import { test, expect, describe } from '@jest/globals';
import { argumentStep, keyStep, shortcutStep, setFocusStep,
    textStep, findStep, canFindStep, urlStep, modKeyStep, skipStep, waitNavStep, 
    trueStep, falseStep} from '../../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab, setFocus, exeUrlNav, shortcut} from '../../WebHelpers/WebHelpers.js';
import { exeKeyboard, exeCanFind, exeInfo, getTabCount, keyStrListMerge,
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

describe('keyStrListMerge', () => {
    test('valid merge simple plus', async () => {
        expect(keyStrListMerge("a+b+c", "d")).toEqual(["a", "b", "c", "d"]);
    });

    test('valid merge simple space', async () => {
        expect(keyStrListMerge("a b c", "d")).toEqual(["a", "b", "c", "d"]);
    });

    test('valid merge single modifier', async () => {
        expect(keyStrListMerge("Control", "d")).toEqual(["Control", "d"]);
    });

    test('valid merge multiple modifiers', async () => {
        expect(keyStrListMerge("Control+Shift", "d")).toEqual(["Control", "Shift", "d"]);
    });

    test('valid merge no main key', async () => {
        expect(keyStrListMerge("a+b+c+d", "")).toEqual(["a", "b", "c", "d"]);
    });

    test('valid merge no modifier', async () => {
        expect(keyStrListMerge("", "a")).toEqual(["a"]);
    });

    test('invalid merge empty', async () => {
        expect(() => keyStrListMerge("", "")).toThrow();
    });

    test('valid merge multiple main keys', async () => {
        /* Note: multiple main keys is not supported and won't be split but
        this is only caught during the execution of the shortcut */
        expect(keyStrListMerge("a+b", "e+f")).toEqual(["a", "b", "e+f"]);
    });
});

describe('parseShortcut', () => {
    test('invalid key step', async () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() => parseShortcut(fakeStep)).toThrow();
    })

    test('valid key step', async () => {
        const scStep = shortcutStep(modKeyStep("Control"), keyStep("t"), waitNavStep(falseStep()), skipStep());
        expect(parseShortcut(scStep)).toEqual({ modKeyStr: "Control", mainKey: "t", waitForNav: "FALSE", setFocusStep: setFocusStep(skipStep()) });
    });
});

describe('exeShortcut', () => {
    test('browser shortcut does nothing', async () => {
        /* Note: puppeteer cannot access browser level shortcuts */
        let tabCount = await getTabCount(context)
        expect (tabCount).toEqual(1);

        await exeShortcut(context, ["Control", "t"], false);

        tabCount = await getTabCount(context);
        expect(tabCount).toEqual(1);
    });

    test('Enter navigation', async () => {
        await exeUrlNav(context, "https://www.scrapethissite.com/pages/forms/");

        const fs = findStep(argumentStep('aria', '[role="textbox"]'));

        const sfStep = setFocusStep(fs);
        await setFocus(context, sfStep);
        await exeShortcut(context, ["Enter"], true);

        const url = await exeInfo(context, "url")
        const expectedUrl = `https://www.scrapethissite.com/pages/forms/?q=`
        expect(url).toEqual(expectedUrl);
    });

    test('Enter navigation, case insensitive', async () => {
        await exeUrlNav(context, "https://www.scrapethissite.com/pages/forms/");

        const fs = findStep(argumentStep('aria', '[role="textbox"]'));

        const sfStep = setFocusStep(fs);
        await setFocus(context, sfStep);
        await exeShortcut(context, ["eNtEr"], true);

        const url = await exeInfo(context, "url")
        const expectedUrl = `https://www.scrapethissite.com/pages/forms/?q=`
        expect(url).toEqual(expectedUrl);
    });

    test('Invalid shortcut, unknown key', async () => {
        await exeUrlNav(context, "https://www.scrapethissite.com/pages/forms/");

        const fs = findStep(argumentStep('aria', '[role="textbox"]'));

        const sfStep = setFocusStep(fs);
        await setFocus(context, sfStep);
        await expect(exeShortcut(context, ["Control+Foo", "a"], true)).rejects.toThrow();
    });
});

describe('shortcut', () => {
    test('shortcut: browser', async () => {
        const scStep = shortcutStep(modKeyStep("Control"), keyStep("t"), waitNavStep(falseStep()), skipStep());
        await shortcut(context, scStep);
        const tabCount = await getTabCount(context);
        expect(tabCount).toEqual(1);
    });

    test('shortcut: enter navigation', async () => {
        await exeUrlNav(context, "https://www.scrapethissite.com/pages/forms/");
        const fs = findStep(argumentStep('aria', '[role="textbox"]'));
        const scStep = shortcutStep(modKeyStep(""), keyStep("Enter"), waitNavStep(trueStep()), fs);

        await shortcut(context, scStep);

        const url = await exeInfo(context, "url")
        const expectedUrl = `https://www.scrapethissite.com/pages/forms/?q=`
        expect(url).toEqual(expectedUrl);
    });
})