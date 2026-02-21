import puppeteer, { Browser, BrowserContext } from 'puppeteer-core';
import { contextToPage } from './WebHelpers.js';

const DEBUG_PORT = 9222; // port used for browser connection
export const DEFAULT_TIMEOUT = 7500;    // Default timeout for pages

let browserInstance = null;
let disconnectFlag = false; // used to prevent multiple running browser connections.

/**
 * Connects to and returns a Puppeteer browser instance.
 * @returns {Promise<Browser>} A promise that resolves with a Puppeteer browser instance.
 */
export async function getBrowser() {
    // check if browser is already connected
    if (browserInstance && browserInstance.connected) {
        return browserInstance;
    }
    try {
        // connect to a headless browser via the specified debug port
        const browser = await puppeteer.connect({
            browserURL: 'http://localhost:' + DEBUG_PORT,
            defaultViewport: null,
            headless: false
        });

        // update contextToPage when new pages are created
        browser.on('targetcreated', async target => { 
            if (target.type() !== 'page') return;

            const page = await target.page();
            if (!page) return;

            const context = page.browserContext();
            contextToPage.set(context, page);
        });

        // handle browser disconnections
        browser.on('disconnected', () => {
            if (!disconnectFlag){
                throw new Error("Browser was closed unexpectedly.")
            }
            console.log("Browser disconnected.");
        });

        browserInstance = browser;
        disconnectFlag = false
        return browser;

    } catch (err) {
        throw new Error(
            `Puppeteer could not connect.
            Ensure browser instance and debug port are open.
            ${err}`
        );
    }
}

/**
 * Disconnects from a Puppeteer browser instance.
 * @param {Browser} browser The browser instance
 *  to disconnect from.
 * @returns {Promise<void>} A promise that resolves when
 *  the disconnection is completed.
 */
export async function browserDisconnect(browser) {
    disconnectFlag = true;
    if (browser.connected) {
        await browser.disconnect();
    }
}

/**
 * Disconnects from a Puppeteer browser given a context instance.
 * @param {BrowserContext} context The browser context
 *  instance to disconnect.
 * @returns {Promise<void>} A promise that resolves when the
 *  disconnection is completed.
 */
export async function browserDisconnectContext(context) {
    const browser = context.browser();
    await browserDisconnect(browser);
}

/**
 * Returns a puppeteer browser context.
 * @param {Boolean} newContext Whether to connect to current context
 *  or start a new one.
 * @returns {Promise<BrowserContext>} A promise that resolves
 *  with a Puppeteer browser context instance.
 * @throws Will throw an error if the connection to the browser context
 * cannot be established.
 */
export async function getContext(browser, newContext = false) {
    let context;
    if (newContext){
        context = createNewContext(browser);
    }
    else {
       context = await browser.defaultBrowserContext();
    }

    return context;
}

/**
 * Creates a new browser context instance.
 * @param {Browser} browser The browser instance to use.
 * @returns {Promise<BrowserContext>} A promise that resolves with
 *  a new browser context instance.
 */
export async function createNewContext(browser) {
    const context = await browser.createBrowserContext();
    return context;
}

/**
 * Closes the given browser context and all of its pages.
 * @param {BrowserContext} context The browser context instance to close.
 * @returns {Promise<void>} A promise that resolves when the context is closed.
 */
export async function closeContext(context) {
    await context.close();
}