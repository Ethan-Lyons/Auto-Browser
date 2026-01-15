import puppeteer from 'puppeteer-core';
const debugPort = 9222;

/**
 * Establishes a Puppeteer connection to an existing  browser instance.
 * @returns {Promise<puppeteer.Browser>} A promise that resolves with a Puppeteer browser instance.
 * @throws Will throw an error if the connection to the browser cannot be established.
 */
export async function browserConnect() {
    try {
        console.log("Establishing connection to Puppeteer...");

        const browser = await puppeteer.connect({
            browserURL: 'http://localhost:' + debugPort, // Browser must be launched with remote debugging enabled
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

/**
 * Disconnects a Puppeteer browser instance.
 * @param {puppeteer.Browser} browser The browser instance to disconnect.
 * @throws Will throw an error if the disconnection fails.
 * @returns {Promise<void>} A promise that resolves when the disconnection is completed.
 */
export async function browserDisconnect(browser) {
    if (browser.connected) {
        await browser.disconnect();
    }
    console.log("Browser disconnected.");
}

/**
 * Disconnects a Puppeteer browser given a context instance.
 * @param {puppeteer.BrowserContext} context The browser context instance to disconnect.
 * @throws Will throw an error if the disconnection fails.
 * @returns {Promise<void>} A promise that resolves when the disconnection is completed.
 */
export async function browserDisconnectContext(context) {
    let browser;
    browser = context.browser();
    await browserDisconnect(browser);
}