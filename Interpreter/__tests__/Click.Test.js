import * as WebHelpers from '../WebHelpers/WebHelpers.js'; 
import { test, expect } from '@jest/globals';

let browser;
let context;

beforeAll(async () => {
    try {
        browser = await WebHelpers.browserConnect();
    } catch (err) {
        console.error('Error connecting to Puppeteer:\n', err);
        process.exit(1);
    }
});

beforeEach(async () => {
    context = await WebHelpers.createNewContext(browser);
});

afterEach(async () => {
    await context.close();
});

afterAll(async () => {
    await WebHelpers.browserDisconnect(browser);
});

test('Click Link', async () => {
    // Navigate
    const url = { value: 'https://google.com' };
    const navAction = { name: 'URL_NAV', args: [url] };

    // link text argument
    const textArg = { name: 'text', value: 'https://policies.google.com/privacy?hl=en&fg=1' };

    // strict = false
    const strictFalse = { name: 'true', value: 'true' };
    const strictGroup = { name: 'strict', selected: strictFalse };

    // link action (text + strict)
    const linkAction = {
        name: 'link',
        args: [textArg, strictGroup]
    };

    // selector group
    const selectorType = {
        name: 'selector',
        selected: linkAction
    };

    // find action
    const findAction = {
        name: 'FIND',
        args: [selectorType]
    };
    
    const clickAction = { name: 'CLICK', args: [findAction]}

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);

    page = await WebHelpers.getActivePage(context)
    startURL = await WebHelpers.getUrl(page)
    await WebHelpers.click(context, clickAction)
    newURL = await WebHelpers.getUrl(page)
    expect(newURL).not.toMatch(startURL)
});

test('Click Xpath', async () => {
    const url = { value: 'google.com'}
    const navAction = { name: 'URL_NAV', args: [url]} // Navigate action

    const xpath = { name: 'xpath', value:  '//a[@href="https://policies.google.com/privacy?hl=en&fg=1"]'};
    const selectorGroup = { name: 'selector', selected: xpath}
    const findAction = { name: 'FIND', args: [selectorGroup] };  // Find action
    const clickAction = { name: 'CLICK', args: [findAction]}

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);

    page = await WebHelpers.getActivePage(context)
    startURL = await WebHelpers.getUrl(page)
    await WebHelpers.click(context, clickAction)
    newURL = await WebHelpers.getUrl(page)
    expect(newURL).not.toMatch(startURL)
});