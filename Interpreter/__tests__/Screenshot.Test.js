import { test, expect, describe } from '@jest/globals';
import { screenshotStep } from '../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab,
    getActiveIndex, getTabs, getActivePage, exeUrlNav } from '../WebHelpers/WebHelpers.js';
import { screenshot, parseScreenshot, exeScreenshot, resolveScrFilePath } from '../WebHelpers/WebHelpers.js';

import fs from 'fs';

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

describe('parseScreenshot', () => {
    test('invalid step', async () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() => parseScreenshot(fakeStep)).toThrow();
    });

    test('valid step', async () => {
        const fileName = "test file name";
        const ssStep = screenshotStep(fileName);
        const result = parseScreenshot(ssStep);
        expect(result).toEqual({ fileName: fileName });
    });
});

describe('resolveScrFilePath', () => {
    test('valid path with extension', () => {
        const directory = "";
        const fileName = "test.png";
        const result = resolveScrFilePath(directory, fileName);
        expect(result).toEqual(directory + fileName);
    });

    test('valid path with jpg extension', () => {
        const directory = "";
        const fileName = "test.jpg";
        const result = resolveScrFilePath(directory, fileName);
        expect(result).toEqual(directory + fileName);
    });

    test('valid path without extension', () => {
        const directory = "";
        const fileName = "test";
        const result = resolveScrFilePath(directory, fileName);
        expect(result).toEqual(directory + fileName + ".png");
    });
});

describe('exeScreenshot', () => {
    test('valid name with extension', async () => {
        const directory = "";
        const fileName = "screenshot.png";
        await exeScreenshot(context, directory, fileName);
        expect(fs.existsSync(directory + fileName)).toBe(true);

        fs.unlinkSync(directory + fileName);
    });

    test('valid name with jpg extension', async () => {
        const directory = "";
        const fileName = "screenshot.jpg";
        await exeScreenshot(context, directory, fileName);
        expect(fs.existsSync(directory + fileName)).toBe(true);

        fs.unlinkSync(directory + fileName);
    });

    test('valid name without extension', async () => {
        const directory = "";
        const fileName = "screenshot";
        await exeScreenshot(context, directory, fileName);
        expect(fs.existsSync(directory + fileName + ".png")).toBe(true);

        fs.unlinkSync(directory + fileName + ".png");
    });
});

describe('screenshot', () => {
    
});