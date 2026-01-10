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
    await WebHelpers.newTab(context);
});

afterEach(async () => {
    await context.close();
});

afterAll(async () => {
    await WebHelpers.browserDisconnect(browser);
});

test('url return', async () => {
    const target = 'google.com'
    const url = { value: target }
    const navAction = { name: 'URL_NAV', args: [url]} // Navigate action
    await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    infoReturn = await WebHelpers.contextToUrl(context)
    expect(infoReturn).toMatch(target)
});

test('url return blank', async () => {
    await WebHelpers.newTab(context);
    const page = await WebHelpers.getActivePage(context);
    const curUrl = await WebHelpers.getUrl(page);
    expect(curUrl).toBe("about:blank");
});