import puppeteer from 'puppeteer-core';
//import assert from 'assert';
export * from './Find.js';
export * from './Info.js';
export * from './Click.js';
export * from './Tab.js';
export * from './WebHelpers.js';
export * from './Routine.js'

// go forward, go back, refresh, hover, screenshot, title, url

const contextToPage = new WeakMap();  // Map from each browser context to its active page
let browserEventHooked = false;

/**
 * Establishes a Puppeteer connection to an existing  browser instance.
 * @returns {Promise<puppeteer.Browser>} A promise that resolves with a Puppeteer browser instance.
 * @throws Will throw an error if the connection to the browser cannot be established.
 */
export async function browserConnect() {
    try {
        console.log("Establishing connection to Puppeteer...");

        const browser = await puppeteer.connect({
            browserURL: 'http://localhost:9222', // Browser must be launched with remote debugging enabled
            defaultViewport: null,
            headless: false
        });

        // Listen for the browser being closed manually
        browser.on('disconnected', () => {
            console.log('Browser manually closed.');
        });

        return browser;
    } catch (err) {
        // Common fixes: check that browser is opened with --remote-debugging-port
        //      close all browser instances in task manager and retry
        throw new Error('Error Puppeteer could not connect:\n' + err);
    }
}

export async function browserDisconnect(browser) {
    try {
        if (browser.connected) {
            await browser.disconnect();
        }
        console.log("Browser disconnected.");

    } catch (err) {
        throw new Error('Error disconnecting from Puppeteer:\n' + err);
    }
}

export async function browserDisconnectContext(context) {
    let browser;
    browser = context.browser();
    await browserDisconnect(browser);
}

export async function connectToContext() {
    try {
        const browser = await browserConnect();
        const context = browser.defaultBrowserContext();

        // Install browser-level listener once
        if (!browserEventHooked) {
            browser.on('targetcreated', async target => {
                if (target.type() !== 'page') return;

                const newPage = await target.page();
                if (!newPage) return;

                const pageContext = newPage.browserContext();
                contextToPage.set(pageContext, newPage);
            });

            browserEventHooked = true;
        }

        return context;
    } catch (err) {
        throw new Error('Error starting context:\n' + err);
    }
}

export async function createNewContext(browser) {
    try {
        const context = await browser.createBrowserContext();
        return context;
    } catch (err) {
        throw new Error('Error creating new context:\n' + err);
    }
}

export async function closeContext(context) {
    try {
        await context.close();
    } catch (err) {
        throw new Error('Error closing context:\n' + err);
    }
}


export function setActivePage(context, page) {
    contextToPage.set(context, page);
}

export async function getActivePage(context) {
    const page = contextToPage.get(context);
    if (context.pages().length == 0) { // check if context is empty
        console.log("Warning (getActivePage): No pages in context.");
        return null;
    }
    else if (page && !page.isClosed()) { // check if page is still open
        return page;
    }
    const pages = await context.pages();
    return pages[0]; // deterministic fallback
}


/**
 * Navigates to a URL.  Use the await keyword to ensure proper execution.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {Object} currentStep An object for a url nav action.
 *      This step should be of type action with the corresponding name value and a url value in its args list.
 */
export async function urlNav(context, currentStep) {
    let urlArg, url, page;
    try {
        if (currentStep.name != "URL_NAV") {
            throw new Error('Invalid step type (urlNav):\n' + err);
        }
        urlArg = currentStep.args[0];
        url = urlArg.value;

        if (!/^https?:\/\//i.test(url)) {   // add url prefix if needed
            url = "https://" + url;
        }
        
        page = await getActivePage(context);
        await Promise.all([
            page.waitForNavigation(),
            page.goto(url)
        ]);
    } catch (err) {
        throw new Error('Navigation (urlNav) error:\n' + err);
    }
}

/*export async function getActivePage(browser) {
    if (global.currentPage) return global.currentPage;
    const pages = await browser.pages();
    for (const page of pages) {     // Edge browser must be on screen for this to work
        const isVisible = await page.evaluate(() => document.visibilityState === 'visible');
        if (isVisible) {
            return page;
        }
    }
    console.log("No active page found. Returning first page.");
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
    console.log("No active page found. Returning first page.");
    return 0; // fallback
}*/

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
        throw new Error('Navigation (getAllParentsAttribute) error:\n' + err);
    }
}