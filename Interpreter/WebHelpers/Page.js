import { getActivePage } from './WebHelpers.js';

/**
 * Navigates to a URL.  Use the await keyword to ensure proper execution.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {Object} navStep An object for a url nav action.
 *      This step should be of type action with the corresponding name value and a url value in its args list.
 */
export async function urlNav(context, navStep) {
    let url;
        if (navStep.name != "URL_NAV") {
            throw new Error('Invalid step type (urlNav):\n' + err);
        }
        const [urlArg] = navStep.args;
        url = urlArg.value;

        if (!/^https?:\/\//i.test(url)) {   // add url prefix if needed
            url = "https://" + url;
        }
        
        const page = await getActivePage(context);
        await Promise.all([
            page.waitForNavigation(),
            page.goto(url)
        ]);
}