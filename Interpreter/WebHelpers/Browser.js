import puppeteer from 'puppeteer-core';
const debugPort = 9222;

import { contextToPage } from './WebHelpers.js';

let browserInstance = null;
let disconnectFlag = false;

export async function getBrowser() {
    if (browserInstance && browserInstance.connected) {
        return browserInstance;
    }
    try {
        const browser = await puppeteer.connect({
            browserURL: 'http://localhost:' + debugPort,
            defaultViewport: null,
            headless: false
        });

        browser.on('targetcreated', async target => { 
            if (target.type() !== 'page') return;

            const page = await target.page();
            if (!page) return;

            const context = page.browserContext();
            contextToPage.set(context, page);
        });

        browser.on('disconnected', () => {    // handle user exits
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
        'Puppeteer could not connect.\n' +
        'Ensure browser instance and debug port are open.\n\n' +
        err
        );
    }
}

/**
 * Disconnects from a Puppeteer browser instance.
 * @param {puppeteer.Browser} browser The browser instance
 *  to disconnect from.
 * @throws Will throw an error if the disconnection fails.
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
 * @param {puppeteer.BrowserContext} context The browser context
 *  instance to disconnect.
 * @throws Will throw an error if the disconnection fails.
 * @returns {Promise<void>} A promise that resolves when the
 *  disconnection is completed.
 */
export async function browserDisconnectContext(context) {
    let browser;
    browser = context.browser();
    await browserDisconnect(browser);
}

/**
 * Returns a puppeteer browser context.
 * @param {boolean} newContext Whether to connect to current context
 *  or start a new one.
 * @returns {Promise<puppeteer.BrowserContext>} A promise that resolves
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
 * @param {puppeteer.Browser} browser The browser instance to use.
 * @returns {Promise<puppeteer.BrowserContext>} A promise that resolves with
 *  a new browser context instance.
 */
export async function createNewContext(browser) {
    const context = await browser.createBrowserContext();
    return context;
}

/**
 * Closes the given browser context and all of its pages.
 * @param {puppeteer.BrowserContext} context The browser context instance to close.
 */
export async function closeContext(context) {
    await context.close();
}