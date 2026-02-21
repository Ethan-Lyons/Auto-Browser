import { test, expect, describe } from '@jest/globals';

import { outputStep, textFileStep, writeStep, appendStep,
    screenShotStep } from '../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab, output, parseOutput,
    exeOutput, defaultOutputDir } from '../WebHelpers/WebHelpers.js';

import fs from 'fs';
import path from 'path';

export const testOutputDirectory = path.normalize(path.join(process.cwd(), "tmp"));

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
        const subStep = screenShotStep("screenshot.png");
        const oStep = outputStep(subStep);
        const result = parseOutput(oStep);

        expect(result).toEqual({ name: subStep.name, step: subStep });
    });
});

describe('exeOutput', () => {
    test('valid mode: SCREENSHOT', async () => {
        await newTab(context);
        const fileName = "screenshot.png"
        const subStep = screenShotStep(fileName);

        await exeOutput(context, subStep.name, subStep);

        // expect file path to exist
        const filePath = path.join(defaultOutputDir, fileName);
        expect(fs.existsSync(filePath)).toBe(true);

        // clean up
        fs.unlinkSync(filePath);
    })

    test('valid mode: TEXT_FILE (write)', async () => {
        const fileName = "WriteTest.txt"
        const subStep = textFileStep("write content", fileName, writeStep());

        await exeOutput(context, subStep.name, subStep);

        // expect file path to exist
        const filePath = path.join(defaultOutputDir, fileName);
        expect(fs.existsSync(filePath)).toBe(true);

        // clean up
        fs.unlinkSync(filePath);
    })

    test('valid mode: TEXT_FILE (append)', async () => {
        const subStep = textFileStep("append content", "AppendTest.txt", appendStep());

        await exeOutput(context, subStep.name, subStep);

        // expect file path to exist
        const filePath = path.join(defaultOutputDir, "AppendTest.txt");
        expect(fs.existsSync(filePath)).toBe(true);

        // clean up
        fs.unlinkSync(filePath);
    })
})

describe('output', () => {
    test('valid mode: SCREENSHOT', async () => {
        await newTab(context);
        const fileName = "screenshot.png"
        const subStep = screenShotStep(fileName);
        const oStep = outputStep(subStep);

        await output(context, oStep);

        // expect file path to exist
        const filePath = path.join(defaultOutputDir, fileName);
        expect(fs.existsSync(filePath)).toBe(true);

        // clean up
        fs.unlinkSync(filePath);
    })

    test('valid mode: TEXT_FILE (write)', async () => {
        const fileName = "WriteTest.txt"
        const subStep = textFileStep("write content", fileName, writeStep());
        const oStep = outputStep(subStep);

        await output(context, oStep);

        // expect file path to exist
        const filePath = path.join(defaultOutputDir, fileName);
        expect(fs.existsSync(filePath)).toBe(true);

        // clean up
        fs.unlinkSync(filePath);
    })

    test('valid mode: TEXT_FILE (append)', async () => {
        const fileName = "AppendTest.txt"
        const subStep = textFileStep("append content", fileName, appendStep());
        const oStep = outputStep(subStep);

        await output(context, oStep);

        // expect file path to exist
        const filePath = path.join(defaultOutputDir, fileName);
        expect(fs.existsSync(filePath)).toBe(true);

        // clean up
        fs.unlinkSync(filePath);
    })
})