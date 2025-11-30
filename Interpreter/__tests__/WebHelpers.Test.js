import * as WebHelpers from '../WebHelpers/WebHelpers.js'; 
import { test, expect } from '@jest/globals';
import * as RoutineInterpreter from '../WebHelpers/RoutineInterpreter.js';
import { url } from 'inspector';

//import RoutineInterpreter from '../WebHelpers/RoutineInterpreter.js'; // causes error
//import assert from 'assert';

test("sanity check", () => {
  expect(true).toBe(true);
});

test('connectToBrowser', async () => {
    browser = await WebHelpers.connectToBrowser();
    await WebHelpers.disconnect(browser);
});

test('disconnect', async () => {
    browser = await WebHelpers.connectToBrowser();
    await WebHelpers.disconnect(browser);
});

test('urlNav', async () => {
    testRoutinePath = '../TestData/testNav.json'
    browser = await WebHelpers.connectToBrowser();
    routine = await WebHelpers.loadRoutineFromFile(testRoutinePath);
    urlActionGroup = routine.steps[0];
    urlAction = actionGroup.selected;
    //urlArg = urlAction.args[0];
    //url = urlArg.value;

    await WebHelpers.urlNav(browser, urlAction);
    await WebHelpers.disconnect(browser);
});

test('getCurrentUrl', async () => {
    browser = await WebHelpers.connectToBrowser();
    url = await WebHelpers.getCurrentUrl(browser);
    await WebHelpers.disconnect(browser);
});

test('tabNumber', async () => {
    browser = await WebHelpers.connectToBrowser();
    tabs = await WebHelpers.getTabs(browser);
    expect(tabs.length).toBe(1);
    await WebHelpers.disconnect(browser);
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