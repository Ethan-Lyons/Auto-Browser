import * as WebHelpers from '../WebHelpers/WebHelpers.js'; 
import { test, expect } from '@jest/globals';
/*
    npm run test:js -- --runTestsByPath Interpreter/__tests__/
*/

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

test('connectToBrowser', async () => { });

test('loadUrlNav', async () => {
    /*await WebHelpers.newTab(context);
    testRoutinePath = './TestData/testNav.json'
    routine = await WebHelpers.jsonToRoutineStack(testRoutinePath);
    urlActionGroup = routine.steps[0];
    urlAction = urlActionGroup.selected;    

    await WebHelpers.urlNav(context, urlAction);*/
});

test('urlNav', async () => {
    await WebHelpers.newTab(context);
    url = {value : 'google.com'}
    navAction = {name : 'URL_NAV', args: [url]}
    await WebHelpers.urlNav(context, navAction);
});