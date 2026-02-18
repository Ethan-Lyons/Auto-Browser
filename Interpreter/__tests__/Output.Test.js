import { test, expect, describe } from '@jest/globals';
import { outputStep, textFileStep, writeStep, appendStep, screenShotStep } from '../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab,
    getActiveIndex, getTabs, getActivePage, exeUrlNav } from '../WebHelpers/WebHelpers.js';
import { output, parseOutput, exeOutput } from '../WebHelpers/WebHelpers.js';

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

describe('parseOutput', () => {
    test('invalid step', () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() => parseOutput(fakeStep)).toThrow();
    });

    test('valid step', () => {
        const subStep = screenShotStep("test file name");
        const oStep = outputStep(subStep);
        const result = parseOutput(oStep);
        expect(result).toEqual({ subStep: subStep });
    });
});

describe('exeOutput', () => {
    
})

describe('output', () => {
    
})