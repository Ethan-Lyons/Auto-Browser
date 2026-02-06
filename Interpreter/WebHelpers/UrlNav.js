import { getActivePage } from './WebHelpers.js';
import { assertStep } from './Assert.js';
import { BrowserContext } from 'puppeteer-core';

/**
 * Navigates to a URL.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {*} navStep An object for a url nav action.
 *  This step should be of type 'action' with the corresponding name 'URL_NAV'
 *  and a url value in its args list.
 */
export async function urlNav(context, navStep) {
    const urlNavSpec = parseUrlNav(navStep);
    await exeUrlNav(context, urlNavSpec.url);
}

/**
 * 
 * @param {*} navStep 
 * @returns 
 */
export function parseUrlNav(navStep) {
    assertStep(navStep, "URL_NAV", "urlNavParse");

    const [urlStep] = navStep.args;
    const urlSpec = parseUrl(urlStep);
    return { url: urlSpec.url }
}

/**
 * 
 * @param {BrowserContext} context 
 * @param {String} url 
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
 * 
 * @param {*} urlStep 
 * @returns 
 */
export function parseUrl(urlStep) {
    assertStep(urlStep, "URL", "urlParse");
    let url = urlStep.value;

    return { url : url }
}