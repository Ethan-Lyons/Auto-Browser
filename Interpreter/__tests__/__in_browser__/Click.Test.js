import { test, expect } from '@jest/globals';

import { argumentStep, clickStep, findStep, linkStep, falseStep,
    trueStep, waitNavStep } from '../../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab, getActivePage,
    exeUrlNav, parseClick, exeClick, click, find } from '../../WebHelpers/WebHelpers.js';

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

describe("parseClick", () => {
    test("parseClick: invalid action", async () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() =>parseClick(fakeStep)).toThrow();
    });

    test("parseClick: valid action", async () => {
        const cStep = clickStep(findStep(argumentStep("text", "example.com")), waitNavStep(trueStep()));
        const cSpec = parseClick(cStep)

        expect(cSpec).toEqual({ findStep: { name: "FIND", type: "ActionGroup",
            selected: argumentStep("text", "example.com")}, waitForNav: "TRUE" });
    });
});


describe("exeClick", () => {
    test("exeClick: link", async () => {
        const fStep = findStep(linkStep("example", falseStep()));
        const locator = await find(context, fStep);

        await exeClick(context, locator, true);

        const page = await getActivePage(context);
        const url = page.url();
        expect(url).toEqual("https://www.iana.org/help/example-domains");
    });

    test("exeClick: text", async () => {
        const fStep = findStep(argumentStep("text", "Learn more"));
        const locator = await find(context, fStep);

        await exeClick(context, locator, true);

        const page = await getActivePage(context);
        const url = page.url();
        expect(url).toEqual("https://www.iana.org/help/example-domains");
    });
});

describe("click", () => {
    test("click: link", async () => {
        const cStep = clickStep(findStep(linkStep("example", falseStep())), waitNavStep(trueStep()));
        await click(context, cStep);

        const page = await getActivePage(context);
        const url = page.url();
        expect(url).toEqual("https://www.iana.org/help/example-domains");
    });

    test("click: text", async () => {
        const cStep = clickStep(findStep(argumentStep("text", "Learn more")), waitNavStep(trueStep()));
        await click(context, cStep);

        const page = await getActivePage(context);
        const url = page.url();
        expect(url).toEqual("https://www.iana.org/help/example-domains");
    });
});