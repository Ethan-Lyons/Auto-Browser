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


test('tabNumber', async () => {
    tabs = WebHelpers.getTabs(context);
    expect(tabs.length).toBe(0);
});

test('tabAdd', async () => {
    await WebHelpers.newTab(context);   // Open 1 tab
    tabs = WebHelpers.getTabs(context);
    expect(tabs.length).toBe(1);
});

test('tabClose', async () => {
    await WebHelpers.newTab(context);   // Open 1 tab
    tabs = WebHelpers.getTabs(context);
    await WebHelpers.closeTab(tabs[0]); // Close 1 tab
    tabs = WebHelpers.getTabs(context);
    expect(tabs.length).toBe(0);
});

test('tabAddClose', async () => {
    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);   // Open 2 tabs

    tabs = WebHelpers.getTabs(context);
    await WebHelpers.closeTab(tabs[0]);
    tabs = WebHelpers.getTabs(context);
    await WebHelpers.closeTab(tabs[0]); // Close 2 tabs

    await WebHelpers.newTab(context);   // Open 1 tab
    expect(tabs.length).toBe(1);
});

test('tabNavNew', async () => {
    const testAction = { tab: 'new' };
    await WebHelpers.navToTab(context, testAction);    // Navigate to new tab
    expect(tabs.length).toBe(1);
});

test('tabNavNext', async () => {
    let curr, expected, tabs;
    const testAction1 = { tab: 'next' };

    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);   // Open 2 tabs
    tabs = WebHelpers.getTabs(context);

    WebHelpers.setActivePage(context, tabs[0]);    // Set first tab as active
    await WebHelpers.navToTab(context, testAction1);    // Navigate to next

    curr = await WebHelpers.getActivePage(context);
    expect(curr).toBe(expected);
});

test('tabNavPrev', async () => {
    let curr, tabs;
    const testAction1 = { tab: 'previous' };

    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);   // Open 2 tabs

    tabs = WebHelpers.getTabs(context);
    await WebHelpers.navToTab(context, testAction1);    // Navigate to previous

    curr = await WebHelpers.getActivePage(context);
    expect(curr).toBe(tabs[0]);
});

test('tabNavNum', async () => {
    let curr, tabs;
    const testAction = { tab: '1' };

    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);   // Open 3 tabs

    tabs = WebHelpers.getTabs(context);
    await WebHelpers.navToTab(context, testAction); // Navigate to tab 1

    curr = await WebHelpers.getActivePage(context);
    expect(curr).toBe(tabs[1]);
});

test('tabNavFirst', async () => {
    let curr, tabs;
    const testAction = { tab: 'first' };

    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);   // Open 2 tabs
    await WebHelpers.navToTab(context, testAction); // Navigate to first

    tabs = WebHelpers.getTabs(context);
    curr = await WebHelpers.getActivePage(context);
    expect(curr).toBe(tabs[0]);
});

test('tabNavLast', async () => {
    let curr, tabs;
    const testAction = { tab: 'last' };

    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);   // Open 2 tabs
    await WebHelpers.navToTab(context, testAction); // Navigate to last

    tabs = WebHelpers.getTabs(context);
    curr = await WebHelpers.getActivePage(context);
    expect(curr).toBe(tabs[1]);
});

test('tabNavCombine', async () => {
    let curr, tabs;
    const testA0 = { tab: 'NEW' };
    const testA1 = { tab: 'f' };
    const testA2 = { tab: '1' };
    const testA3 = { tab: 'N' };
    const testA4 = { tab: 'L ' };
    const testA5 = { tab: 'pReV ' };

    await WebHelpers.navToTab(context, testA0);
    await WebHelpers.navToTab(context, testA0);
    await WebHelpers.navToTab(context, testA0); // Open 3 tabs

    await WebHelpers.navToTab(context, testA1); // Switch to first tab
    await WebHelpers.navToTab(context, testA2); // Switch to index 1
    await WebHelpers.navToTab(context, testA3); // Switch to next
    await WebHelpers.navToTab(context, testA4); // Switch to last tab (already at last tab)
    await WebHelpers.navToTab(context, testA5); // Switch to previous

    tabs = WebHelpers.getTabs(context);
    curr = await WebHelpers.getActivePage(context);
    expect(curr).toBe(tabs[1]); // Should be at index 1
});

