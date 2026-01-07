import * as WebHelpers from '../WebHelpers/WebHelpers.js'; 
import { test, expect } from '@jest/globals';

let browser;
let context;

const url = { value: 'google.com'}
const navAction = { name: 'URL_NAV', args: [url]} // Navigate action

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
    await WebHelpers.newTab(context);
});

afterEach(async () => {
    await context.close();
});

afterAll(async () => {
    await WebHelpers.browserDisconnect(browser);
});

test('Find Link Fail', async () => {
    // link text argument
    const textArg = { name: 'text', value: '$$$foobar&&&', type: 'argument'};

    // strict = false
    const strictFalse = { name: 'false', value: 'false', type: 'argument'};
    const strictGroup = { name: 'strict', selected: strictFalse };

    // link action (text + strict)
    const linkAction = { name: 'link', args: [textArg, strictGroup]};

    // selector group
    const selectorType = { name: 'selector', selected: linkAction};

    // find action
    const findAction = { name: 'FIND', args: [selectorType]};

    await WebHelpers.urlNav(context, navAction);
    const locator = await WebHelpers.find(context, findAction);
    await expect(locator.waitHandle()).rejects.toThrow()
});

test('Find Link Contains', async () => {
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

    await WebHelpers.urlNav(context, navAction);
    const locator = await WebHelpers.find(context, findAction);
    expect(await locator.waitHandle()).toBeDefined();
});


test('Find Link Is', async () => {
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

    await WebHelpers.urlNav(context, navAction);
    const locator = await WebHelpers.find(context, findAction);
    expect(await locator.waitHandle()).toBeDefined();
});

test('Find Xpath', async () => {
    const xpath = { name: 'xpath', value:  '//a[@href="https://policies.google.com/privacy?hl=en&fg=1"]'};
    const selectorGroup = { name: 'selector', selected: xpath}
    const findAction = { name: 'FIND', args: [selectorGroup] };  // Find action

    await WebHelpers.urlNav(context, navAction);
    const locator = await WebHelpers.find(context, findAction);
    expect(await locator.waitHandle()).toBeDefined()
});

test('Find Text' , async () => {
    const text = { name: 'text', value: 'Privacy'};
    const selectorGroup = { name: 'selector', selected: text}
    const findAction = { name: 'FIND', args: [selectorGroup] };  // Find action

    await WebHelpers.urlNav(context, navAction);
    const locator = await WebHelpers.find(context, findAction);
    expect(await locator.waitHandle()).toBeDefined()
})

test('Find CSS' , async () => {
    const css = { name: 'css', value: '*'};
    const selectorGroup = { name: 'selector', selected: css}
    const findAction = { name: 'FIND', args: [selectorGroup] };  // Find action

    await WebHelpers.urlNav(context, navAction);
    const locator = await WebHelpers.find(context, findAction);
    expect(await locator.waitHandle()).toBeDefined()
})

test('Find Aria' , async () => {
    const aria = { name: 'aria', value: 'Privacy'};
    const selectorGroup = { name: 'selector', selected: aria}
    const findAction = { name: 'FIND', args: [selectorGroup] };  // Find action

    await WebHelpers.urlNav(context, navAction);
    const locator = await WebHelpers.find(context, findAction);
    expect(await locator.waitHandle()).toBeDefined()
})


