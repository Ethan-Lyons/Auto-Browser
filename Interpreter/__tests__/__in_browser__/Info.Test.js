import { test, expect, describe } from '@jest/globals';
import { Routine } from '../WebHelpers/Routine.js';
import { parseInfo, exeInfo, routineInfo } from '../../WebHelpers/WebHelpers.js';
import { infoStep, textStep, userAction, argumentStep } from '../StepFactory.js';
import * as WebHelpers from '../WebHelpers/WebHelpers.js';

let browser;
let context;
let page;

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
        const inStep = infoStep(textStep("modeName"));
        const infoSpec = await parseInfo(inStep);
        expect(infoSpec).toEqual({ mode: "modeName" });
    });
});

describe("exeInfo", () => {
    test("exeInfo: invalid action", async () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() => exeInfo(fakeStep)).toThrow();
    });

    test("exeInfo: tab count none", async () => {
        const inStep = infoStep(argumentStep("tab_count", null));
        const result = await exeInfo(context, "tab_count");
        expect(result).toEqual(0);
    });

    test("exeInfo: tab count", async () => {
        const inStep = infoStep(argumentStep("tab_count", null));
        await WebHelpers.newTab(context);
        const result = await exeInfo(context, "tab_count");
        expect(result).toEqual(1);
    });


});

//tab count, title, url, current index