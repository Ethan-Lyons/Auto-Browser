import * as WebHelpers from '../WebHelpers/WebHelpers.js';
import { test, expect } from '@jest/globals';

let browser;
let context;

const url = { value: 'google.com' };
const navAction = { name: 'URL_NAV', args: [url] };

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

test('Can Find False', async () => {
    const textArg = { name: 'text', value: '$$$foobar&&&', type: 'argument' };

    const strictTrue = { name: 'true', value: 'true', type: 'argument' };
    const strictGroup = { name: 'strict', selected: strictTrue };

    const linkAction = { name: 'link', args: [textArg, strictGroup] };

    const findAction = { name: 'find', selected: linkAction };

    const canFind = { name: 'can_find', args: [findAction]}

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    const result = await WebHelpers.canFind(context, canFind)
    expect(result).toBe(false)
});

test('Can Find True', async () => {
    const textArg = { name: 'text', value: 'privacy', type: 'argument' };

    const strictFalse = { name: 'false', value: 'false', type: 'argument' };
    const strictGroup = { name: 'strict', selected: strictFalse };

    const linkAction = { name: 'link', args: [textArg, strictGroup] };

    const findAction = { name: 'find', selected: linkAction };

    const canFind = { name: 'can_find', args: [findAction]}

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    const result = await WebHelpers.canFind(context, canFind)
    expect(result).toBe(true)
});