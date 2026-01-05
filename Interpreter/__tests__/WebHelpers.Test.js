import * as WebHelpers from '../WebHelpers/WebHelpers.js'; 
import { test, expect } from '@jest/globals';
//import * as RoutineInterpreter from '../WebHelpers/RoutineInterpreter.js';
//import { url } from 'inspector';

//import RoutineInterpreter from '../WebHelpers/RoutineInterpreter.js'; // causes error
//import assert from 'assert';

let browser;
let context;
let page;

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


test("sanity check", () => {
  expect(true).toBe(true);
});

test('connectToBrowser', async () => {
    
});

/*test('disconnect', async () => {
    browser = await WebHelpers.connectToBrowser();
    await WebHelpers.disconnect(browser);
});*/

test('loadUrlNav', async () => {
    await WebHelpers.newTab(context);
    testRoutinePath = './TestData/testNav.json'
    //browser = await WebHelpers.connectToBrowser();
    routine = await WebHelpers.loadRoutineFromJSON(testRoutinePath);
    urlActionGroup = routine.steps[0];
    urlAction = urlActionGroup.selected;

    console.log(" urlAction: " + urlAction.name + " " + urlAction.type + " " + urlAction.args[0].value);
    

    await WebHelpers.urlNav(context, urlAction);
    //await WebHelpers.browserDisconnect(browser);
});

test('urlNav', async () => {
    await WebHelpers.newTab(context);
    url = {value : 'google.com'}
    navAction = {name : 'URL_NAV', args: [url]}
    await WebHelpers.urlNav(context, navAction);
});

test('getCurrentUrl', async () => {
    //browser = await WebHelpers.browserConnect();
    //curUrl = await WebHelpers.getActiveUrl(context);
    await WebHelpers.newTab(context);
    page = await WebHelpers.getActivePage(context);
    curUrl = await WebHelpers.getUrl(page);
    expect(curUrl).toBe("about:blank");
    //await WebHelpers.browserDisconnect(browser);
});



//tab # test

//tab add test


/* NEED TO UPDATE: RoutineInterpreter needs to take a routine as input */


/*async function main() {
    const newBrowser = await WebHelpers.connectToBrowser();
    try {
        let urlArg;
        let navStep;
        urlArg = {      //also assuming i have a py program which can generate this, how can i use those methods in this js script? or should i?
            type: 'Argument',
            name: 'url',
            value: 'google.com',
            description: ''
        }
        navStep = {
                    type: 'Action',
                    name: 'URL_NAV',
                    args: [urlArg],
                    description: 'Go to URL'
                }

        await WebHelpers.urlNav(newBrowser, navStep);
        const currentUrl = await WebHelpers.getCurrentUrl(newBrowser);
        //assert.equal(currentUrl, 'https://www.google.com/');    
    } catch (err) {
        console.error('Error disconnecting from Puppeteer:\n', err);
        process.exit(1);
    } finally {
        await WebHelpers.disconnect(newBrowser);
    }
}

main()
*/