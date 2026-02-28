import { BrowserContext } from 'puppeteer-core';
import { getActivePage, assertStep, URL_NAME } from './WebHelpers.js';

export const URL_NAV_NAME = "URL_NAV";

/**
 * Parses a urlNavStep and performs a urlNav action.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {{name: "URL_NAV", type: "Action", args: [Object]}} navStep An object
 * containing the information for the urlNav action.
 */
export async function urlNav(context, navStep) {
    const urlNavSpec = parseUrlNav(navStep);
    await exeUrlNav(context, urlNavSpec.url);
}

/**
 * Obtains important values from a 'urlNavStep' input and returns them using an object.
 * @param {{name: "URL_NAV", type: "Action", args: [Object]}} navStep An object
 * containing the information for the urlNav action.
 * @returns {{url: string}}
 */
export function parseUrlNav(navStep) {
    assertStep(navStep, URL_NAV_NAME, "urlNavParse");

    const [urlStep] = navStep.args;
    const urlSpec = parseUrl(urlStep);

    return { url: urlSpec.url }
}

/**
 * Performs the action of navigating to a URL.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {string} url The URL to navigate to.
 * @returns {Promise<void>} A promise that resolves when the navigation is complete.
 */
export async function exeUrlNav(context, url) {
    const page = await getActivePage(context);
    if (!page) {
        throw new Error("urlNavExe: no available pages in context.");
    }

    if (!/^https?:\/\//i.test(url)) {   // add url prefix if needed
        url = "https://" + url;
    }

    await Promise.all([
        page.waitForNavigation(),
        page.goto(url)
    ]);
}

/**
 * Obtains important values from a 'urlStep' input and returns them using an object.
 * @param {{name: "URL", type: "Argument", value: string}} urlStep 
 * @returns {{url: string}}
 */
export function parseUrl(urlStep) {
    assertStep(urlStep, URL_NAME, "urlParse");
    let url = urlStep.value;

    return { url : url }
}