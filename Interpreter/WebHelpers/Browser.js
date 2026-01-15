import puppeteer from 'puppeteer-core';
const debugPort = 9222;

/**
 * Establishes a Puppeteer connection to an existing browser instance.
 * @returns {Promise<puppeteer.Browser>} A promise that resolves
 *  with a Puppeteer browser instance.
 * @throws Will throw an error if the connection to the browser
 *  cannot be established.
 */
export async function browserConnect() {
    try {
        console.log("Establishing connection to Puppeteer...");

        const browser = await puppeteer.connect({
            // Browser must be launched with matching port open
            browserURL: 'http://localhost:' + debugPort, 
            defaultViewport: null,
            headless: false
        });

        // Listen for the browser being closed manually
        browser.on('disconnected', () => {
            console.log('Browser manually closed.');
        });

        return browser;
    } catch (err) {
        throw new Error('Puppeteer could not connect.\n' +
            'Ensure browser instance and debug port are open. ' + 
            'If error persists, close all browser instances and retry.\n' +
            'Error:\n' + err);
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
    if (browser.connected) {
        await browser.disconnect();
    }
    console.log("Browser disconnected.");
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