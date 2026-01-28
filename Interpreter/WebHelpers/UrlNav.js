import { getActivePage } from './WebHelpers.js';
import { assertStep } from './Assert.js';

/**
 * Navigates to a URL.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {Object} navStep An object for a url nav action.
 *  This step should be of type 'action' with the corresponding name 'URL_NAV'
 *  and a url value in its args list.
 */
export async function urlNav(context, navStep) {
    const urlNavSpec = urlNavParse(navStep);
    await urlNavExe(context, urlNavSpec.url);
}

export function urlNavParse(navStep) {
    assertStep(navStep, "URL_NAV", "urlNavParse");

    const [urlStep] = navStep.args;
    const urlSpec = urlParse(urlStep);
    return { url: urlSpec.url }
}

export async function urlNavExe(context, url) {
    const page = await getActivePage(context);

    if (!page) {
        throw new Error("urlNavExe: no available pages in context.");
    }

    await Promise.all([
        page.waitForNavigation(),
        page.goto(url)
    ]);
}


export function urlParse(urlStep) {
    assertStep(urlStep, "URL", "urlParse");

    let url = urlStep.value;
    if (!/^https?:\/\//i.test(url)) {   // add url prefix if needed
        url = "https://" + url;
    }

    return { url : url }
}