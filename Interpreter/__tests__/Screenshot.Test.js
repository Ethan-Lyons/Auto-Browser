import { test, expect, describe } from '@jest/globals';
import { screenshotStep } from '../StepFactory.js';

import { getBrowser, getContext, browserDisconnect,
    newTab } from '../WebHelpers/WebHelpers.js';
    
import { screenshot, parseScreenshot, exeScreenshot,
    resolveScrFilePath } from '../WebHelpers/WebHelpers.js';

import fs from 'fs';

import { testOutputDirectory } from './Output.Test.js';
import path from 'path';

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
        //const directory = "";
        const fileName = "test.png";
        const result = resolveScrFilePath(testOutputDirectory, fileName);
        expect(result).toEqual(path.join(testOutputDirectory, fileName));
    });

    test('valid path with jpg extension', () => {
        //const directory = "";
        const fileName = "test.jpg";
        const result = resolveScrFilePath(testOutputDirectory, fileName);
        expect(result).toEqual(path.join(testOutputDirectory, fileName));
    });

    test('valid path without extension', () => {
        const directory = "";
        const fileName = "test";
        const result = resolveScrFilePath(testOutputDirectory, fileName);
        expect(result).toEqual(path.join(testOutputDirectory, fileName + ".png"));
    });
});

describe('exeScreenshot', () => {
    test('valid name with extension', async () => {
        const directory = "";
        const fileName = "screenshot.png";
        await exeScreenshot(context, testOutputDirectory, fileName);
        expect(fs.existsSync(path.join(testOutputDirectory, fileName))).toBe(true);

        fs.unlinkSync(path.join(testOutputDirectory, fileName));
    });

    test('valid name with jpg extension', async () => {
        const directory = "";
        const fileName = "screenshot.jpg";
        await exeScreenshot(context, testOutputDirectory, fileName);

        const filePath = path.join(testOutputDirectory, fileName)
        expect(fs.existsSync(filePath)).toBe(true);

        fs.unlinkSync(filePath);
    });

    test('valid name without extension', async () => {
        const directory = "";
        const fileName = "screenshot";
        await exeScreenshot(context, testOutputDirectory, fileName);

        const filePath = path.join(testOutputDirectory, fileName + ".png")
        expect(fs.existsSync(filePath)).toBe(true);

        fs.unlinkSync(filePath);
    });
});

describe('screenshot', () => {
    test('valid screenshot', async () => {
        const ssStep = screenshotStep("screenshot.png");
        await screenshot(context, ssStep, testOutputDirectory);

        const filePath = path.join(testOutputDirectory, "screenshot.png")
        expect(fs.existsSync(filePath)).toBe(true);

        fs.unlinkSync(filePath);
    })
});