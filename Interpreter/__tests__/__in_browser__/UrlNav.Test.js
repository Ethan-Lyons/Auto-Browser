import { test, expect, describe } from '@jest/globals';

import { urlNavStep } from "../../StepFactory.js";

import { getBrowser, getContext, browserDisconnect, newTab,
    getActivePage } from '../../WebHelpers/WebHelpers.js';
import { parseUrlNav, exeUrlNav, urlNav }  from '../../WebHelpers/WebHelpers.js';

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


describe("parseUrlNav", () => {
    test("parseUrlNav: invalid action", async () => {
        const urlNavStep = { name: "FOO", args: [null] };
        expect(() => parseUrlNav(urlNavStep)).toThrow();
    });

    test("parseUrlNav: valid action", async () => {
        const urlStep = urlNavStep("example.com");
        const urlSpec = parseUrlNav(urlStep);
        expect(urlSpec).toEqual({ url: "example.com" });
    });
});

describe("exeUrlNav", () => {
    test("exeUrlNav: navigation", async () => {
        await newTab(context);

        await exeUrlNav(context, "example.com");

        const page = await getActivePage(context);
        const url = await page.url();
        expect(url).toEqual("https://example.com/");
    });
});

describe("urlNav", () => {
    test("urlNav: navigation", async () => {
        await newTab(context);
        await urlNav(context, urlNavStep("example.com"));
        const page = await getActivePage(context);
        const url = await page.url();
        expect(url).toEqual("https://example.com/");
    });
});