import * as WebHelpers from '../WebHelpers/WebHelpers.js'; 
import { test, expect } from '@jest/globals';

let browser;
let context;
let page;

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

function openTabWithUrl(context, url) {
    
}

test('url return', async () => {
    const target = 'google.com'
    const url = { name: 'url', value: target }
    const navAction = { name: 'URL_NAV', args: [url]} // Navigate action
    page = await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    infoReturn = await WebHelpers.getUrl(page);
    expect(infoReturn).toMatch(target)
});

test('url return blank', async () => {
    await WebHelpers.newTab(context);
    const page = await WebHelpers.getActivePage(context);
    const curUrl = await WebHelpers.getUrl(page);
    expect(curUrl).toBe("about:blank");
});

test('title return', async () => {
    const target = 'Google'
    const url = { name: 'url', value: 'google.com' }
    const navAction = { name: 'URL_NAV', args: [url]} // Navigate action
    page = await WebHelpers.newTab(context);
    await WebHelpers.urlNav(context, navAction);
    infoReturn = await WebHelpers.getTitle(page)
    expect(infoReturn).toMatch(target)
});

test('title return blank', async () => {
    await WebHelpers.newTab(context);
    const page = await WebHelpers.getActivePage(context);
    const curTitle = await WebHelpers.getTitle(page);
    expect(curTitle).toBe("");
});

test('tab count', async () => {
    const tabs = await WebHelpers.getTabs(context);
    const tabCount = await WebHelpers.getTabCount(context);
    expect(tabCount).toBe(tabs.length);
});