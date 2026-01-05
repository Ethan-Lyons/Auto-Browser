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

test('Find Link Fail', async () => {
    const url = {value : 'google.com'}
    const navAction = {name : 'URL_NAV', args: [url]} // Navigate action

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    const linkType = { name: 'contains', value: '$$$foobar&&&' };
    const link = { name: 'link', selected: linkType };
    const selectorType = { name: 'selector', selected: link };
    const findAction = { name: 'FIND', args: [selectorType] };
    const element = await WebHelpers.find(context, findAction);
    expect(element).toBe(null);
});

test('Find Link Contains', async () => {
    // Navigate
    const url = { value: 'https://google.com' };
    const navAction = { name: 'URL_NAV', args: [url] };

    // link text argument
    const textArg = { name: 'text', value: 'privacy' };

    // strict = false
    const strictFalse = { name: 'false', value: 'false' };
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

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);

    const element = await WebHelpers.find(context, findAction);
    expect(element).toBeDefined();
});


test('Find Link Is', async () => {
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

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);

    const element = await WebHelpers.find(context, findAction);
    expect(element).toBeDefined();
});

test('Find Xpath', async () => {
    const url = { value: 'google.com'}
    const navAction = { name: 'URL_NAV', args: [url]} // Navigate action

    const xpath = { name: 'xpath', value:  '/html/body/div[1]/div[3]/form/div[1]/div[1]/div[3]/center/input[1]'};
    const selectorGroup = { name: 'selector', selected: xpath}
    const findAction = { name: 'FIND', args: [selectorGroup] };  // Find action

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    const element = await WebHelpers.find(context, findAction);
    expect(element).toBeDefined()
});

test('Find ID', async () => {
    // TODO: implement real test
    const url = {value : 'google.com'}
    const navAction = {name : 'URL_NAV', args: [url]} // Navigate action

    //linkType = { name: 'contains', value: ['https://policies.google.com/privacy?hl=en&fg=1'] };
    //link = { name: 'link', selected: linkType };
    //const selectorType = { name: 'selector', selected: link };
    //const findAction = { name: 'FIND', args: [selectorType] };  // Find link action

    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    const element = await WebHelpers.find(context, findAction);
    expect(element).toBeDefined()
});

