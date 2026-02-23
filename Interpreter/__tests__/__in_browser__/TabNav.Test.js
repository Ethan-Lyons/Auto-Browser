import { test, expect, describe, beforeAll, beforeEach, afterEach, afterAll } from '@jest/globals';

import { tabNavStep } from '../../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab,
    getActiveIndex, parseTabNav, exeTabNav, tabNav } from '../../WebHelpers/WebHelpers.js';

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

describe("parseTabNav", () => {
    test ('parseTabNav: invalid', async () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() => parseTabNav(fakeStep)).toThrow();
    })
    test('parseTabNav: valid', async () => {
        const navStep = tabNavStep("1");
        const navSpec = parseTabNav(navStep);
        expect(navSpec).toEqual({ tab: "1" });
    });
});

describe("exeTabNav: numbers", () => {
    test('exeTabNav: number', async () => {
        await newTab(context);
        await newTab(context);

        await exeTabNav(context, "0");

        const currIndex = await getActiveIndex(context);
        expect(currIndex).toBe(0);
    });

    test('exeTabNav: negative number', async () => {
        await newTab(context);
        await newTab(context);
        
        await exeTabNav(context, "-1");

        const currIndex = await getActiveIndex(context);
        expect(currIndex).toBe(1);
    });

    test('exeTabNav: over tab count number', async () => {
        await newTab(context);
        await newTab(context);
        
        await exeTabNav(context, "2");

        const currIndex = await getActiveIndex(context);
        expect(currIndex).toBe(1);
    });
});

describe("exeTabNav: strings", () => {
    test ('exeTabNav: invalid string', async () => {
        await newTab(context);
        await expect(exeTabNav(context, "FOO")).rejects.toThrow();
    })

    test('exeTabNav: next', async () => {
        await newTab(context);
        await newTab(context);

        await exeTabNav(context, "0");
        await exeTabNav(context, "next");

        const currIndex = await getActiveIndex(context);
        expect(currIndex).toBe(1);
    })

    test('exeTabNav: next on last', async () => {
        await newTab(context);
        await newTab(context);
        
        await exeTabNav(context, "next");

        const currIndex = await getActiveIndex(context);
        expect(currIndex).toBe(1);
    });

    test('exeTabNav: previous', async () => {
        await newTab(context);
        await newTab(context);
        
        await exeTabNav(context, "previous"); 

        const currIndex = await getActiveIndex(context);
        expect(currIndex).toBe(0);
    });

    test('exeTabNav: previous on first', async () => {
        await newTab(context);
        await newTab(context);
        
        await exeTabNav(context, "previous");
        await exeTabNav(context, "previous");

        const currIndex = await getActiveIndex(context);
        expect(currIndex).toBe(0);
    });

    test('exeTabNav: last', async () => {
        await newTab(context);
        await newTab(context);
        
        await exeTabNav(context, "last");

        const currIndex = await getActiveIndex(context);
        expect(currIndex).toBe(1);
    });

    test('exeTabNav: first', async () => {
        await newTab(context);
        await newTab(context);
        
        await exeTabNav(context, "first");

        const currIndex = await getActiveIndex(context);
        expect(currIndex).toBe(0);
    });

    test('exeTabNav: combine', async () => {
        await newTab(context);
        await newTab(context);
        await newTab(context);
        
        await exeTabNav(context, "f");  // first
        await exeTabNav(context, "1");  // second
        await exeTabNav(context, "N");  // third (next)
        await exeTabNav(context, "L"); // last
        await exeTabNav(context, "pReV ");  // previous

        const currIndex = await getActiveIndex(context);
        expect(currIndex).toBe(1);
    });
});

describe("tabNav", () => {
    test('tabNav: invalid', async () => {
        await newTab(context);
        
        const fakeStep = { name: "FOO", args: [null] };
        await expect(tabNav(fakeStep)).rejects.toThrow();
    })

    test('tabNav: valid', async () => {
        const navStep = tabNavStep("0");
        await newTab(context);
        await newTab(context);

        await tabNav(context, navStep);

        const currIndex = await getActiveIndex(context);
        expect(currIndex).toBe(0);
    })
});