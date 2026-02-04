import * as WebHelpers from '../../WebHelpers/WebHelpers.js';
import { test, expect } from '@jest/globals';
import { argumentStep, clickStep, findStep } from '../../StepFactory.js';
import { parseClick, exeClick, click } from '../../WebHelpers/WebHelpers.js';

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

/*
export async function click(context, clickStep) {
    const findStep = parseClick(clickStep);

    const locator = await find(context, findStep);
    const page = await getActivePage(context);
    
    await exeClick(page, locator);
}

export function parseClick(clickStep) {
    assertStep(clickStep, 'CLICK', 'parseClick');

    const [findStep] = clickStep.args;
    return findStep;
}

export async function exeClick(page, locator) {
    await Promise.allSettled([
        page.waitForNavigation({ waitUntil: 'networkidle0'}),
        locator.click(),
    ]);
} */

describe("parseClick", () => {
    test("parseClick: invalid action", async () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() =>parseClick(fakeStep)).toThrow();
    });

    test("parseClick: valid action", async () => {
        const cStep = clickStep(findStep(argumentStep("text", "example.com")));
        const cSpec = parseClick(cStep)
        expect(cSpec).toEqual({ findStep: { name: "FIND", type: "ActionGroup", selected: argumentStep("text", "example.com")}});
    });
});


test('Click Link', async () => {
    /*const url = { name: 'url', value: 'https://google.com' };
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
    expect(newURL).not.toMatch(startURL);*/


});

test('Click Xpath', async () => {
    /*const url = { name: 'url', value: 'google.com' };
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
    expect(newURL).not.toMatch(startURL);*/

    
});