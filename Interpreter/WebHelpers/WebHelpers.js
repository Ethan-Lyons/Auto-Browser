import puppeteer from 'puppeteer-core';
import assert from 'assert';
export * from './Find.js';
export * from './Info.js';
export * from './Click.js';
export * from './Tab.js';
export * from './WebHelpers.js';

export async function handleStep(browser, currentStep) {
    try {
        if(currentStep.name == CLICK) {
          const selectedGroupStep = currentStep.args[0];
          const selectedType = selectedGroupStep.selected;
          await WebHelpers.click(browser, selectedType);
        }
        else if (currentStep.name == FIND) {
          const selectedGroupStep = currentStep.args[0];
          const selectedType = selectedGroupStep.selected;
          await WebHelpers.find(browser, selectedType); //currentStep);
        }
        else if (currentStep.name == FIND_GROUP) {
          await WebHelpers.findGroup(browser, currentStep);
        }
        else if (currentStep.name == URL_NAV) {
          await WebHelpers.urlNav(browser, currentStep);
        }
        else if (currentStep.name == TAB_NAV) {
          await WebHelpers.navToTab(browser, currentStep);
        }
        else if (currentStep.name == NEW_TAB) {
          await WebHelpers.newTab(browser);
        }
      } catch (err) {
        console.error('\nError during execution of action: ' + currentStep.name + '\n', err);
        process.exit(1);
      }
    }

/**
 * Establishes a Puppeteer connection to an existing  browser instance.
 * @returns {Promise<puppeteer.Browser>} A promise that resolves with a Puppeteer browser instance.
 * @throws Will throw an error if the connection to the browser cannot be established.
 */
export async function connectToBrowser() {
    try {
        console.log("Establishing connection to Puppeteer...");

        const browser = await puppeteer.connect({
            browserURL: 'http://localhost:9222', // Browser must be launched with remote debugging enabled
            defaultViewport: null,
            headless: false
        });

        // Listen for the browser being closed manually
        browser.on('disconnected', () => {
            console.log('Browser manually closed. Exiting script.');
            process.exit(0);
        });

        // Track when the active tab changes
        browser.on('targetchanged', async target => {
            const page = await target.page();
            if (page) {
                console.log("Active tab changed:", await page.title());
                // Save this page globally
                global.currentPage = page;
            }
        });

        return browser;
    } catch (err) {
        console.error('Error Puppeteer could not connect:\n', err);
        process.exit(1);
    }
}

export async function disconnect(browser) {
    try {
        await browser.disconnect();
        console.log("Browser disconnected.");
    } catch (err) {
        console.error('Error disconnecting from Puppeteer:\n', err);
        // Common fixes: check that browser is opened with --remote-debugging-port
        //      close all browser instances in task manager and retry
        process.exit(1);
    }
}

/**
 * Navigates to a URL.  Use the await keyword to ensure proper execution.
 * @param {puppeteer.Browser} browser The browser instance to use.
 * @param {Object} currentStep A dictionary entry for a url nav action.
 */
export async function urlNav(browser, currentStep) {
    let urlArg, url, page;
    try {
        assert(browser && browser.isConnected(), "Browser is not connected");
        urlArg = currentStep.args[0];
        url = urlArg.value;

        if (!/^https?:\/\//i.test(url)) {   // add url prefix if needed
            url = "https://" + url;
        }
        
        page = await getActivePage(browser);
        await Promise.all([
            page.waitForNavigation(),
            page.goto(url)
        ]);
    } catch (err) {
        console.error('Navigation (urlNav) error:\n', err);
        process.exit(1);
    }
}



export async function getActivePage(browser) {
    if (global.currentPage) return global.currentPage;
    const pages = await browser.pages();
    for (const page of pages) {     // Edge browser must be open for this to work
        const isVisible = await page.evaluate(() => document.visibilityState === 'visible');
        if (isVisible) {
            return page;
        }
    }
    console.log("No active page found. Using first page.");
    return pages[0]; // fallback
}
export async function getActiveIndex(browser) {
    const pages = await browser.pages();
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const isVisible = await page.evaluate(() => document.visibilityState === 'visible');
        if (isVisible) {
            return i;
        }
    }
    console.log("No active page found. Using first page.");
    return 0; // fallback
}

export async function groupGetByAttribute(parents, type, attribute, value, strict = false) {
    try {
        const newList = [];
        for (let i = 0; i < parents.length; i++) {
            const currentParent = parents[i];
            const newItem = await findByAttribute(currentParent, type, attribute, value, strict);
            newList[i] = newItem;
        }
        return newList;    
    } catch (err) {
        console.error('Navigation (getAllParentsAttribute) error:\n', err);
        process.exit(1);
    }
}