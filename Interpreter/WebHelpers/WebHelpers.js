import puppeteer from 'puppeteer-core';
export * from './Find.js';
export * from './Info.js';
export * from './Click.js';
export * from './Tab.js';
export * from './Group.js';
export * from './Browser.js';
export * from './Page.js';
export * from './WebHelpers.js';
export * from './StepsHandler.js'
export * from './Store.js'
export * from './StoreVariables.js'

// TODO:  go forward, go back, refresh, hover, screenshot, title, url

let browserEventHooked = false;
const contextToPage = new WeakMap();  // Map from each browser context to its active page

/**
 * Establishes a connection to the Puppeteer browser and returns the default context.
 * @returns {Promise<puppeteer.BrowserContext>} A promise that resolves with a Puppeteer browser context instance.
 * @throws Will throw an error if the connection to the browser context cannot be established.
 */
export async function connectToContext() {
    try {
        const browser = await browserConnect();
        const context = await browser.defaultBrowserContext();

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

/**
 * Creates a new browser context instance.
 * @param {puppeteer.Browser} browser The browser instance to use.
 * @returns {Promise<puppeteer.BrowserContext>} A promise that resolves with a new browser context instance.
 * @throws Will throw an error if the context creation fails.
 */
export async function createNewContext(browser) {
    try {
        const context = await browser.createBrowserContext();
        return context;
        
    } catch (err) {
        throw new Error('Error creating new context:\n' + err);
    }
}

/**
 * Closes the given browser context and all of its pages.
 * @param {puppeteer.BrowserContext} context The browser context instance to close.
 * @throws {Error} If there is an error closing the context.
 */
export async function closeContext(context) {
    try {
        await context.close();

    } catch (err) {
        throw new Error('Error closing context (closeContext):\n' + err);
    }
}


/**
 * Sets the active page in the given context.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {puppeteer.Page} page The page to set as active.
 * @throws {Error} If there is an error setting the active page.
 */
export async function setActivePage(context, page) {
    try{
        contextToPage.set(context, page);
        await page.bringToFront();

    } catch (err) {
        throw new Error('Error setting active page (setActivePage):\n' + err);
    }
}

/**
 * Retrieves the active page in the browser context.
 * If there are no pages in the context, return null.
 * If the current active page is still open, return it.
 * Otherwise, set the first page in the context as the active page and return it.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @returns {Promise<puppeteer.Page>} The active page in the browser context.
 * @throws {Error} Error during execution of action.
 */
export async function getActivePage(context) {
    try {
        const page = contextToPage.get(context);
        if (context.pages().length === 0) { // check if context is empty
            console.log("Warning (getActivePage): No pages in context.");
            return null;
        }
        else if (page && !page.isClosed()) { // check if page is still open
            return page;
        }
        const pages = await context.pages();
        setActivePage(context, pages[0]);
        return pages[0]; // deterministic fallback

    } catch (err) {
        throw new Error('Error getting active page (getActivePage):\n' + err);
    }
}

export async function getActiveIndex(context) {
    const page = await getActivePage(context);
    const pages = await context.pages();
    return pages.indexOf(page);
}