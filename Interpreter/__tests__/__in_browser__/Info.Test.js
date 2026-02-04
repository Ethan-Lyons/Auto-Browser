import { test, expect, describe } from '@jest/globals';
import { parseInfo, exeInfo, info } from '../../WebHelpers/WebHelpers.js';
import { infoStep, textStep, userAction, argumentStep } from '../../StepFactory.js';
import * as WebHelpers from '../../WebHelpers/WebHelpers.js';

let browser;
let context;

beforeAll(async () => {
    try {
        browser = await WebHelpers.getBrowser();
    } catch (err) {
        console.error('Error connecting to Puppeteer:\n', err);
        process.exit(1);
    }
});

beforeEach(async () => {
    context = await WebHelpers.getContext(browser, true);
});

afterEach(async () => {
    await context.close();
});

afterAll(async () => {
    await WebHelpers.browserDisconnect(browser);
});


describe("parseInfo", () => {
    test("parseInfo: invalid action", async () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() => parseInfo(fakeStep)).toThrow();
    });

    test("parseInfo: valid action", async () => {
        const inStep = infoStep(argumentStep("modeName", null));
        const infoSpec = parseInfo(inStep);
        expect(infoSpec).toEqual({ mode: "modeName" });
    });
});

describe("exeInfo: tab count", () => {
    test("exeInfo: tab count", async () => {
        const inStep = infoStep(argumentStep("tab_count", null));
        await WebHelpers.newTab(context);
        const result = await exeInfo(context, "tab_count");
        expect(result).toEqual(1);
    });

    test("exeInfo: tab count none", async () => {
        const inStep = infoStep(argumentStep("tab_count", null));
        const result = await exeInfo(context, "tab_count");
        expect(result).toEqual(0);
    });
});

describe("exeInfo: current index", () => {
    test("exeInfo: current index none", async () => {
        const inStep = infoStep(argumentStep("current_index", null));
        const result = await exeInfo(context, "current_index");
        expect(result).toEqual(-1);
    })

    test("exeInfo: current index", async () => {
        const inStep = infoStep(argumentStep("current_index", null));
        await WebHelpers.newTab(context);
        const result = await exeInfo(context, "current_index");
        expect(result).toEqual(0);
    });
});

describe("exeInfo: title", () => {
    test("exeInfo: title none", async () => {
        const inStep = infoStep(argumentStep("title", null));
        const result = await exeInfo(context, "title");
        expect(result).toEqual(null);
    })

    test("exeInfo: title blank", async () => {
        const inStep = infoStep(argumentStep("title", null));
        await WebHelpers.newTab(context);
        const result = await exeInfo(context, "title");
        expect(result).toEqual("");
    });

    test("exeInfo: title", async () => {
        const inStep = infoStep(argumentStep("title", null));
        await WebHelpers.newTab(context);
        await WebHelpers.exeUrlNav(context, "example.com");
        const result = await exeInfo(context, "title");
        expect(result).toEqual("Example Domain");
    });
});

describe("exeInfo: url", () => {
    test("exeInfo: url none", async () => {
        const inStep = infoStep(argumentStep("url", null));
        const result = await exeInfo(context, "url");
        expect(result).toEqual(null);
    })

    test("exeInfo: url blank", async () => {
        const inStep = infoStep(argumentStep("url", null));
        await WebHelpers.newTab(context);
        const result = await exeInfo(context, "url");
        expect(result).toEqual("about:blank");
    });

    test("exeInfo: url", async () => {
        const inStep = infoStep(argumentStep("url", null));
        await WebHelpers.newTab(context);
        await WebHelpers.exeUrlNav(context, "example.com");
        const result = await exeInfo(context, "url");
        expect(result).toEqual("https://example.com/");
    });
});

describe("info", () => {
    test("info: url", async () => {
        const inStep = infoStep(argumentStep("url", null));
        await WebHelpers.newTab(context);
        await WebHelpers.exeUrlNav(context, "example.com");
        const result = await info(context, inStep);
        expect(result).toEqual("https://example.com/");
    });

    test("info: title", async () => {
        const inStep = infoStep(argumentStep("title", null));
        await WebHelpers.newTab(context);
        await WebHelpers.exeUrlNav(context, "example.com");
        const result = await info(context, inStep);
        expect(result).toEqual("Example Domain");
    });

    test("info: tab count", async () => {
        const inStep = infoStep(argumentStep("tab_count", null));
        await WebHelpers.newTab(context);
        const result = await info(context, inStep);
        expect(result).toEqual(1);
    });

    test("info: current index", async () => {
        const inStep = infoStep(argumentStep("current_index", null));
        await WebHelpers.newTab(context);
        const result = await info(context, inStep);
        expect(result).toEqual(0);
    });
});