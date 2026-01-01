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

/*test('findFail', async () => {
    WebHelpers.newTab(context);
    linkType = { name: 'contains', value: ['privacy'] };
    link = { name: 'link', selected: linkType };
    selectorType = { name: 'selector', selected: link };
    const findAction = { name: 'FIND', args: [selectorType] };
    element = await WebHelpers.find(context, findAction);
    expect(element).toBe(null);
});*/

test('sanityCheck' , async () => {
    expect(true).toBe(true);
})