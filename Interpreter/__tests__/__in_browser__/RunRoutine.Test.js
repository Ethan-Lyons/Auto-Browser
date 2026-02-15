import { test, expect, describe } from '@jest/globals';
import { argumentStep } from '../../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab,
    getActiveIndex, getTabs, getActivePage, exeUrlNav } from '../../WebHelpers/WebHelpers.js';
import { parseRunRoutine } from '../../WebHelpers/WebHelpers.js';

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