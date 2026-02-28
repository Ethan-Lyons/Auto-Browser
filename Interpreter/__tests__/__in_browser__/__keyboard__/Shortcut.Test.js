import { test, expect, describe, beforeAll, beforeEach, afterEach, afterAll } from '@jest/globals';

import { argumentStep, shortcutStep, setFocusStep, findStep, keysStep,
    skipStep, waitNavStep, trueStep, falseStep} from '../../../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab, setFocus, exeUrlNav,
    shortcut, exeInfo, getTabCount, keyStrToList, parseShortcut,
    exeShortcut } from '../../../WebHelpers/WebHelpers.js';

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
        expect(keyStrToList("a+b+c")).toEqual(["a", "b", "c"]);
    });

    test('valid merge simple space', async () => {
        expect(keyStrToList("a b c")).toEqual(["a", "b", "c"]);
    });

    test('valid merge single modifier', async () => {
        expect(keyStrToList("Control d")).toEqual(["Control", "d"]);
    });

    test('valid merge multiple modifiers', async () => {
        expect(keyStrToList("Control+Shift+d")).toEqual(["Control", "Shift", "d"]);
    });

    test('valid merge no keys', async () => {
        expect(keyStrToList("")).toEqual([]);
    });
});

describe('parseShortcut', () => {
    test('invalid key step', async () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() => parseShortcut(fakeStep)).toThrow();
    })

    test('valid key step', async () => {
        const scStep = shortcutStep(keysStep("Control+t"), waitNavStep(falseStep()), skipStep());
        expect(parseShortcut(scStep)).toEqual({ keysStr: "Control+t", waitForNav: "FALSE", setFocusStep: setFocusStep(skipStep()) });
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
        const scStep = shortcutStep(keysStep("Control+t"), waitNavStep(falseStep()), skipStep());
        await shortcut(context, scStep);
        const tabCount = await getTabCount(context);
        expect(tabCount).toEqual(1);
    });

    test('shortcut: enter navigation', async () => {
        await exeUrlNav(context, "https://www.scrapethissite.com/pages/forms/");
        const fs = findStep(argumentStep('aria', '[role="textbox"]'));
        const scStep = shortcutStep(keysStep("Enter"), waitNavStep(trueStep()), fs);

        await shortcut(context, scStep);

        const url = await exeInfo(context, "url")
        const expectedUrl = `https://www.scrapethissite.com/pages/forms/?q=`
        expect(url).toEqual(expectedUrl);
    });
})