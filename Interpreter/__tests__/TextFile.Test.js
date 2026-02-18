import { test, expect, describe } from '@jest/globals';
import { infoStep, textStep, userAction, argumentStep, textFileStep, writeStep, appendStep } from '../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab,
    getActiveIndex, getTabs, getActivePage, exeUrlNav } from '../WebHelpers/WebHelpers.js';
import { exeTextFile, parseTextFile, textFile, resolveTextFilePath } from '../WebHelpers/WebHelpers.js';

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
        
        expect(result).toEqual({ text: text, fileName: fileName, mode: writeStep().name });
    });
});

describe('resolveTextFilePath', () => {
    test('valid path with extension', () => {
        const directory = "";
        const fileName = "test.txt";
        const result = resolveTextFilePath(directory, fileName);
        expect(result).toEqual(directory + fileName);
    });

    test('valid path without extension', () => {
        const directory = "";
        const fileName = "test";
        const result = resolveTextFilePath(directory, fileName);
        expect(result).toEqual(directory + fileName + ".txt");
    });

    test('invalid file name', () => {
        const directory = "";
        const fileName = "???";
        expect(() => resolveTextFilePath(directory, fileName)).toThrow();
    });
});

describe('exeTextFile', () => {
    test('write', () => {
        const content = "write content";
        const fileName = "WriteTest.txt";

        const textMode = writeStep();
        exeTextFile(content, "./", fileName, textMode.name);

        const filePath = resolveTextFilePath("./", fileName);

        // expect path to exist
        expect(fs.existsSync(filePath)).toBe(true);

        fs.unlinkSync(filePath);
    });

    test('append to empty', () => {
        const content = "append content";
        const fileName = "AppendTest.txt";

        const textMode = appendStep();
        exeTextFile(content, "./", fileName, textMode.name);

        const filePath = resolveTextFilePath("./", fileName);
        
        // expect path to exist
        expect(fs.existsSync(filePath)).toBe(true);

        fs.unlinkSync(filePath);
    });

    test('append to existing', () => {
        const content = "append content";
        const fileName = "AppendTest2.txt";

        const textMode = appendStep();
        exeTextFile(content, "./", fileName, textMode.name);
        exeTextFile(content, "./", fileName, textMode.name);

        const filePath = resolveTextFilePath("./", fileName);
        
        // expect path to exist
        expect(fs.existsSync(filePath)).toBe(true);

        fs.unlinkSync(filePath);
    });
});

describe('textFile', () => {
    
});