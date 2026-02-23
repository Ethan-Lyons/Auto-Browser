import { test, expect, describe, beforeAll, beforeEach, afterEach, afterAll } from '@jest/globals';

import { textFileStep, writeStep, appendStep } from '../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, exeTextFile, parseTextFile, textFile,
    resolveTextFilePath, defaultOutputDir } from '../WebHelpers/WebHelpers.js';

import fs from 'fs';
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
});

afterEach(async () => {
    await context.close();
});

afterAll(async () => {
    await browserDisconnect(browser);
});

describe('parseTextFile', () => {
    test('invalid step', () => {
        fakeStep = { name: "FOO", args: [null] };
        expect(() => parseTextFile(fakeStep)).toThrow();
    });

    test('valid step', () => {
        const text = "test content";
        const fileName = "test file name";

        const textMode = writeStep();
        const tfStep = textFileStep(text, fileName, textMode);
        const result = parseTextFile(tfStep);
        
        expect(result).toEqual({
            text: text,
            fileName: fileName,
            mode: textMode.name
        });
    });
});

describe('resolveTextFilePath', () => {
    test('valid path with extension', () => {
        const fileName = "test.txt";
        const result = resolveTextFilePath(defaultOutputDir, fileName);
        expect(result).toEqual(path.join(defaultOutputDir, fileName));
    });

    test('valid path without extension', () => {
        const fileName = "test";
        const result = resolveTextFilePath(defaultOutputDir, fileName);
        expect(result).toEqual(path.join(defaultOutputDir, fileName + ".txt"));
    });

    test('invalid file name', () => {
        const fileName = "???";
        expect(() => resolveTextFilePath(defaultOutputDir, fileName)).toThrow();
    });
});

describe('exeTextFile', () => {
    test('write', () => {
        const content = "write content";
        const fileName = "WriteTest.txt";

        const textMode = writeStep();
        exeTextFile(content, defaultOutputDir, fileName, textMode.name);

        const filePath = resolveTextFilePath(defaultOutputDir, fileName);

        // expect path to exist
        expect(fs.existsSync(filePath)).toBe(true);

        fs.unlinkSync(filePath);
    });

    test('append to empty', () => {
        const content = "append content";
        const fileName = "AppendTest.txt";

        const textMode = appendStep();
        exeTextFile(content, defaultOutputDir, fileName, textMode.name);

        const filePath = resolveTextFilePath(defaultOutputDir, fileName);
        
        // expect path to exist
        expect(fs.existsSync(filePath)).toBe(true);

        fs.unlinkSync(filePath);
    });

    test('append to existing', () => {
        const content = "append content";
        const fileName = "AppendTest2.txt";

        const textMode = appendStep();
        exeTextFile(content, defaultOutputDir, fileName, textMode.name);
        exeTextFile(content, defaultOutputDir, fileName, textMode.name);

        const filePath = resolveTextFilePath(defaultOutputDir, fileName);
        
        // expect path to exist
        expect(fs.existsSync(filePath)).toBe(true);

        fs.unlinkSync(filePath);
    });
});

describe('textFile', () => {
    test('valid step write', () => {
        const fileName = "WriteTest.txt";

        const textMode = writeStep();
        const tfStep = textFileStep("write content", "WriteTest.txt", textMode);

        textFile(tfStep, defaultOutputDir);

        // outputs to default directory
        const filePath = resolveTextFilePath(defaultOutputDir, fileName);
        
        // expect path to exist
        expect(fs.existsSync(filePath)).toBe(true);

        fs.unlinkSync(filePath);
    })

    test('valid step append', () => {
        const fileName = "AppendTest.txt";

        const textMode = appendStep();
        const tfStep = textFileStep("append content", "AppendTest.txt", textMode);

        textFile(tfStep, defaultOutputDir);

        // outputs to default directory
        const filePath = resolveTextFilePath(defaultOutputDir, fileName);
        
        // expect path to exist
        expect(fs.existsSync(filePath)).toBe(true);

        fs.unlinkSync(filePath);
    })
});