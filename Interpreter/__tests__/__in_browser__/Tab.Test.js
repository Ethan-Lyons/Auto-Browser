import { test, expect, describe } from '@jest/globals';
import { newTabStep, closeTabStep } from '../../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab,
    getActiveIndex, getTabs, getActivePage } from '../../WebHelpers/WebHelpers.js';
import { parseCloseTab, exeCloseTab, closeTab, getTabCount, resolveTabIndex, clampTabIndex } from '../../WebHelpers/WebHelpers.js';

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

describe("getTabCount", () => {
    test('getTabCount: valid', async () => {
        const count = await getTabCount(context);
        expect(count).toBe(0);
    })
})

describe("getTabs", () => {
    test('getTabs: valid', async () => {
        const tabs = await getTabs(context);
        expect(tabs.length).toBe(0);
    })
})

describe("newTab", () => {
    test('newTab: one', async () => {
        await newTab(context);

        const count2 = await getTabCount(context);
        expect(count2).toBe(1);
    })

    test('newTab: two', async () => {
        await newTab(context);
        await newTab(context);

        const count2 = await getTabCount(context);
        expect(count2).toBe(2);
    })
})

describe("parseCloseTab", () => {
    test('parseCloseTab: invalid', async () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() => parseCloseTab(fakeStep)).toThrow();
    })

    test('parseCloseTab: valid', async () => {
        const cTabStep = closeTabStep("0");
        cTabSpec = parseCloseTab(cTabStep);
        expect(cTabSpec).toEqual({ tab: "0" });
    })
})

describe("exeCloseTab", () => {
    test('exeCloseTab: valid', async () => {
        await newTab(context);
        await newTab(context);
        await newTab(context);

        const count = await getTabCount(context);
        expect(count).toBe(3);

        await exeCloseTab(context, "0");
        const count2 = await getTabCount(context);
        expect(count2).toBe(2);
    })

    test('exeCloseTab: all tabs', async () => {
        await newTab(context);
        
        await exeCloseTab(context, "0");
        const count = await getTabCount(context);
        expect(count).toBe(0);
    })

    test('exeCloseTab: no tabs', async () => {
        await exeCloseTab(context, "0");
        const count = await getTabCount(context);
        expect(count).toBe(0);
    })

    test('exeCloseTab: outside of range', async () => {
        await newTab(context);
        await newTab(context);

        const count = await getTabCount(context);
        expect(count).toBe(2);
        await exeCloseTab(context, "3");
        const count2 = await getTabCount(context);
        expect(count2).toBe(2);
    })
})

describe("closeTab", () => {
    test('closeTab: valid', async () => {
        await newTab(context);
        await newTab(context);

        const count = await getTabCount(context);
        expect(count).toBe(2);

        const cTStep = closeTabStep("0");
        await closeTab(context, cTStep);
        const count2 = await getTabCount(context);
        expect(count2).toBe(1);
    })
})

describe("resolveTabIndex: number", () => {
    test('resolveTabIndex: valid number', async () => {
        const tabSpec = resolveTabIndex("0", 0, 0);
        expect(tabSpec.index).toBe(0);
    })

    test('resolveTabIndex: negative number', async () => {
        const tabSpec = resolveTabIndex("-1", 0, 0);
        expect(tabSpec.index).toBe(-1);  // Outside cases are handled during exe
    })

    test('resolveTabIndex: over tab count number', async () => {
        const tabSpec = resolveTabIndex("1", 0, 0);
        expect(tabSpec.index).toBe(1);  // Outside cases are handled during exe
    })
})

describe("resolveTabIndex: string", () => {
    test('resolveTabIndex: invalid string', async () => {
        expect(() => resolveTabIndex("FOO", 0, 0)).toThrow();
    })

    test('resolveTabIndex: next', async () => {
        const tabSpec = resolveTabIndex("next", 1, 3);
        expect(tabSpec.index).toBe(2);
    })

    test('resolveTabIndex: previous', async () => {
        const tabSpec = resolveTabIndex("previous", 1, 3);
        expect(tabSpec.index).toBe(0);
    })

    test('resolveTabIndex: last', async () => {
        const tabSpec = resolveTabIndex("last", 1, 3);
        expect(tabSpec.index).toBe(2);
    })

    test('resolveTabIndex: first', async () => {
        const tabSpec = resolveTabIndex("first", 1, 3);
        expect(tabSpec.index).toBe(0);
    })
})

describe("clampTabIndex", () => {
    test('clampTabIndex: valid index', async () => {
        const index = clampTabIndex(0, 2);
        expect(index).toBe(0);
    })

    test('clampTabIndex: negative index', async () => {
        const index = clampTabIndex(-1, 2);
        expect(index).toBe(0);
    })

    test('clampTabIndex: over tab count index', async () => {
        const index = clampTabIndex(2, 2);
        expect(index).toBe(1);
    })
})