import * as WebHelpers from '../WebHelpers/WebHelpers.js';
import { test, expect } from '@jest/globals';

let browser;
let context;

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

test('Click Link', async () => {
    const url = { value: 'https://google.com' };
    const navAction = { name: 'URL_NAV', args: [url] };

    const textArg = {
        name: 'text',
        value: 'https://policies.google.com/privacy?hl=en&fg=1'
    };

    const strictTrue = { name: 'true', value: 'true' };
    const strictGroup = { name: 'strict', selected: strictTrue };

    const linkAction = {
        name: 'link',
        args: [textArg, strictGroup]
    };

    const findAction = {
        name: 'FIND',
        selected: linkAction
    };

    const clickAction = {
        name: 'CLICK',
        args: [findAction]
    };

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);

    const page = await WebHelpers.getActivePage(context);
    const startURL = await WebHelpers.getUrl(page);

    await WebHelpers.click(context, clickAction);

    const newURL = await WebHelpers.getUrl(page);
    expect(newURL).not.toMatch(startURL);
});

test('Click Xpath', async () => {
    const url = { value: 'google.com' };
    const navAction = { name: 'URL_NAV', args: [url] };

    const xpath = {
        name: 'xpath',
        value: '//a[@href="https://policies.google.com/privacy?hl=en&fg=1"]'
    };

    const findAction = {
        name: 'FIND',
        selected: xpath
    };

    const clickAction = {
        name: 'CLICK',
        args: [findAction]
    };

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);

    const page = await WebHelpers.getActivePage(context);
    const startURL = await WebHelpers.getUrl(page);

    await WebHelpers.click(context, clickAction);

    const newURL = await WebHelpers.getUrl(page);
    expect(newURL).not.toMatch(startURL);
});