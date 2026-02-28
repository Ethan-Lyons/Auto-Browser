import { test, expect, describe, beforeAll, beforeEach, afterEach, afterAll } from '@jest/globals';

import { findStep, argumentStep, blankStep, textStep, linkStep, trueStep,
    falseStep } from '../../../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab, exeUrlNav,
    parseFind, exeFind, find } from '../../../WebHelpers/WebHelpers.js';

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
    await exeUrlNav(context, "example.com");
});

afterEach(async () => {
    await context.close();
});

afterAll(async () => {
    await browserDisconnect(browser);
});

describe("parseFind", () => {
    test("parseFind: invalid action", async () => {
        const fakeStep = { name: "FOO", type: "FOO", args: [null] };
        expect(() =>parseFind(fakeStep)).toThrow();
    });

    test("parseFind: valid action", async () => {
        const fStep = findStep(blankStep());
        const result = parseFind(fStep);
        expect(result).toEqual({ mode: "BLANK", step: blankStep() });
    });
});

describe("Find: find link", () => {
    test('Find Link: invalid', async () => {
        const linkAction = linkStep('$$foobar&&', falseStep());

        const findAction = findStep(linkAction);

        const locator = await find(context, findAction);
        await expect(locator.waitHandle()).rejects.toThrow();
    });

    test('Find Link: valid, strict = false', async () => {
        const linkAction = linkStep('example', falseStep());

        const findAction = findStep(linkAction);

        const locator = await find(context, findAction);
        expect(await locator.waitHandle()).toBeDefined();
    });

    test('Find Link: valid, strict = true', async () => {
        const linkAction = linkStep('https://iana.org/domains/example', trueStep());

        const findAction = findStep(linkAction);

        const locator = await find(context, findAction);
        expect(await locator.waitHandle()).toBeDefined();
    });

    test('Find Link: invalid, strict = true, missing http', async () => {
        const linkAction = linkStep('iana.org/domains/example', trueStep());

        const findAction = findStep(linkAction);

        const locator = await find(context, findAction);
        await expect(locator.waitHandle()).rejects.toThrow();
    });

    test('Find Link: invalid, strict = true, partial link', async () => {
        const linkAction = linkStep('https://iana.org', trueStep());

        const findAction = findStep(linkAction);

        const locator = await find(context, findAction);
        await expect(locator.waitHandle()).rejects.toThrow();
    });
});


describe("Find: xpath", () => {
    test('Find Xpath: item not found', async () => {
        const xpath = argumentStep('xpath', '//a[@FOO="BAR"]');
        const findAction = findStep(xpath);

        const locator = await find(context, findAction);
        await expect(locator.waitHandle()).rejects.toThrow();
    });

    test('Find Xpath: item found', async () => {
        const xpath = argumentStep('xpath', '//a');
        const findAction = findStep(xpath);

        const locator = await find(context, findAction);
        expect(await locator.waitHandle()).toBeDefined();
    });
});

describe("Find: text", () => {
    test('Find Text: item not found', async () => {
        const text = textStep('foobar');
        const findAction = findStep(text);

        const locator = await find(context, findAction);
        await expect(locator.waitHandle()).rejects.toThrow();
    })

    test('Find Text: item not found, case not matching', async () => {
        const text = textStep('lEaRn mOrE');
        const findAction = findStep(text);

        const locator = await find(context, findAction);
        await expect(locator.waitHandle()).rejects.toThrow();
    });

    test('Find Text: item found, case matching', async () => {
        const text = textStep('Learn more');
        const findAction = findStep(text);

        const locator = await find(context, findAction);
        expect(await locator.waitHandle()).toBeDefined();
    });

    test('Find text: contains text', async () => {
        const text = textStep('Learn');
        const findAction = findStep(text);

        const locator = await find(context, findAction);
        expect(await locator.waitHandle()).toBeDefined();
    })

    test('Find text: special characters', async () => {
        await exeUrlNav(context,
            "https://www.iana.org/assignments/ipv4-address-space/ipv4-address-space.xhtml");
        const text = textStep('https://rdap.apnic.net/');
        const findAction = findStep(text);

        const locator = await find(context, findAction);
        expect(await locator.waitHandle()).toBeDefined();
    });

    test('Find text: backslash', async () => {
        await exeUrlNav(context,
            "https://en.wikipedia.org/wiki/List_of_typographical_symbols_and_punctuation_marks");
        const text = textStep('\\');
        const findAction = findStep(text);

        const locator = await find(context, findAction);
        expect(await locator.waitHandle()).toBeDefined();
    })

    
});

describe("Find: CSS", () => {
    test('Find CSS: item found', async () => {
        const css = argumentStep('css', '*');
        const findAction = findStep(css);

        const locator = await find(context, findAction);
        expect(await locator.waitHandle()).toBeDefined();
    });

    test('Find CSS: item not found', async () => {
        const css = argumentStep('css', 'foobar');
        const findAction = findStep(css);

        const locator = await find(context, findAction);
        await expect(locator.waitHandle()).rejects.toThrow();
    })
});

describe("Find Aria", () => {
    test('Find Aria: valid', async () => {
        const aria = argumentStep('aria', 'Learn more');
        const findAction = findStep(aria);

        const locator = await find(context, findAction);
        expect(await locator.waitHandle()).toBeDefined();
    });

    test('Find Aria: invalid', async () => {
        const aria = argumentStep('aria', 'foobar');
        const findAction = findStep(aria);

        const locator = await find(context, findAction);
        await expect(locator.waitHandle()).rejects.toThrow();
    })

    test('Find Aria: invalid, partial match', async () => {
        const aria = argumentStep('aria', 'more');
        const findAction = findStep(aria);

        const locator = await find(context, findAction);
        await expect(locator.waitHandle()).rejects.toThrow();
    })
});






