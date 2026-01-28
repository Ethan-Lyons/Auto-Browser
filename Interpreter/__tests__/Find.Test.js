import * as WebHelpers from '../WebHelpers/WebHelpers.js';
import { test, expect } from '@jest/globals';

let browser;
let context;

// TODO: create function for new tab + page nav

const url = { name: 'url', value: 'google.com' };
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

test('Find Link Fail', async () => {
    const textArg = { name: 'text', value: '$$$foobar&&&', type: 'argument' };

    const strictFalse = { name: 'false', value: 'false', type: 'argument' };
    const strictGroup = { name: 'strict', selected: strictFalse };

    const linkAction = { name: 'link', args: [textArg, strictGroup] };

    const findAction = { name: 'FIND', selected: linkAction };

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    const locator = await WebHelpers.find(context, findAction);
    await expect(locator.waitHandle()).rejects.toThrow();
});

test('Find Link Contains', async () => {
    const textArg = { name: 'text', value: 'privacy' };

    const strictFalse = { name: 'false', value: 'false' };
    const strictGroup = { name: 'strict', selected: strictFalse };

    const linkAction = { name: 'link', args: [textArg, strictGroup] };

    const findAction = { name: 'FIND', selected: linkAction };

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    const locator = await WebHelpers.find(context, findAction);
    expect(await locator.waitHandle()).toBeDefined();
});

test('Find Link Is', async () => {
    const textArg = {
        name: 'text',
        value: 'https://policies.google.com/privacy?hl=en&fg=1'
    };

    const strictTrue = { name: 'true', value: 'true' };
    const strictGroup = { name: 'strict', selected: strictTrue };

    const linkAction = { name: 'link', args: [textArg, strictGroup] };

    const findAction = { name: 'FIND', selected: linkAction };

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    const locator = await WebHelpers.find(context, findAction);
    expect(await locator.waitHandle()).toBeDefined();
});

test('Find Xpath', async () => {
    const xpath = {
        name: 'xpath',
        value: '//a[@href="https://policies.google.com/privacy?hl=en&fg=1"]'
    };

    const findAction = { name: 'FIND', selected: xpath };

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    const locator = await WebHelpers.find(context, findAction);
    expect(await locator.waitHandle()).toBeDefined();
});

test('Find Text', async () => {
    const text = { name: 'text', value: 'Privacy' };

    const findAction = { name: 'FIND', selected: text };

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    const locator = await WebHelpers.find(context, findAction);
    expect(await locator.waitHandle()).toBeDefined();
});

test('Find CSS', async () => {
    const css = { name: 'css', value: '*' };

    const findAction = { name: 'FIND', selected: css };

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    const locator = await WebHelpers.find(context, findAction);
    expect(await locator.waitHandle()).toBeDefined();
});

test('Find Aria', async () => {
    const aria = { name: 'aria', value: 'Privacy' };

    const findAction = { name: 'FIND', selected: aria };

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    const locator = await WebHelpers.find(context, findAction);
    expect(await locator.waitHandle()).toBeDefined();
});