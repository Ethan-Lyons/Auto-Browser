import * as WebHelpers from '../WebHelpers/WebHelpers.js';
import { test, expect } from '@jest/globals';

let browser;
let context;

function tabNavAction(value) {
    return {
        name: "TAB_NAV",
        args: [
            { type: "tab", value }
        ]
    };
}

beforeAll(async () => {
    browser = await WebHelpers.getBrowser();
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

test('tabNumber', async () => {
    const tabs = await WebHelpers.getTabs(context);
    expect(tabs.length).toBe(0);
});

test('tabAdd', async () => {
    await WebHelpers.newTab(context);
    const tabs = await WebHelpers.getTabs(context);
    expect(tabs.length).toBe(1);
});

test('tabClose', async () => {
    await WebHelpers.newTab(context);
    let tabs = await WebHelpers.getTabs(context);

    await WebHelpers.closeTab(tabs[0]);
    tabs = await WebHelpers.getTabs(context);

    expect(tabs.length).toBe(0);
});

test('tabAddClose', async () => {
    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);

    let tabs = await WebHelpers.getTabs(context);
    await WebHelpers.closeTab(tabs[0]);
    tabs = await WebHelpers.getTabs(context);
    await WebHelpers.closeTab(tabs[0]);

    await WebHelpers.newTab(context);
    tabs = await WebHelpers.getTabs(context);

    expect(tabs.length).toBe(1);
});

test('tabNavNext', async () => {
    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);

    const tabs = await WebHelpers.getTabs(context);
    await WebHelpers.setActivePage(context, tabs[0]);

    await WebHelpers.tabNav(context, tabNavAction('next'));

    const curr = await WebHelpers.getActivePage(context);
    expect(curr).toBe(tabs[1]);
});

test('tabNavPrev', async () => {
    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);

    await WebHelpers.tabNav(context, tabNavAction('previous'));

    const tabs = await WebHelpers.getTabs(context);
    const curr = await WebHelpers.getActivePage(context);

    expect(curr).toBe(tabs[0]);
});

test('tabNavNum', async () => {
    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);

    const tabs = await WebHelpers.getTabs(context);
    await WebHelpers.tabNav(context, tabNavAction('1'));

    const curr = await WebHelpers.getActivePage(context);
    expect(curr).toBe(tabs[1]);
});

test('tabNavFirst', async () => {
    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);

    await WebHelpers.tabNav(context, tabNavAction('first'));

    const tabs = await WebHelpers.getTabs(context);
    const curr = await WebHelpers.getActivePage(context);
    expect(curr).toBe(tabs[0]);
});

test('tabNavLast', async () => {
    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);

    await WebHelpers.tabNav(context, tabNavAction('last'));

    const tabs = await WebHelpers.getTabs(context);
    const curr = await WebHelpers.getActivePage(context);
    expect(curr).toBe(tabs[1]);
});

test('tabNavCombine', async () => {
    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);
    await WebHelpers.newTab(context);

    await WebHelpers.tabNav(context, tabNavAction('f'));
    await WebHelpers.tabNav(context, tabNavAction('1'));
    await WebHelpers.tabNav(context, tabNavAction('N'));
    await WebHelpers.tabNav(context, tabNavAction('L '));
    await WebHelpers.tabNav(context, tabNavAction('pReV '));

    const tabs = await WebHelpers.getTabs(context);
    const curr = await WebHelpers.getActivePage(context);

    expect(curr).toBe(tabs[1]);
});