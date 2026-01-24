import { defaultOutputDir, getActivePage } from './WebHelpers.js';

/**
 * Navigates to a URL.  Use the await keyword to ensure proper execution.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {Object} navStep An object for a url nav action.
 *  This step should be of type 'action' with the corresponding name 'URL_NAV'
 *  and a url value in its args list.
 */
export async function urlNav(context, navStep) {
    let url;
        if (navStep.name != "URL_NAV") {
            throw new Error('Invalid step type for urlNav.' );
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

export async function history(context, historyStep) {
    const page = await getActivePage(context)
    const [historyMode] = historyStep.args
    const selectedMode = historyMode.selected
    const name = selectedMode.value
    
    if (name === 'go_forward') {
        await page.goForward()
    }
    else if (name === 'go_backward') {
        await page.goBack()
    }
    else {
        throw new Error('Unsupported history mode. Step: ' +
            historyStep.name + ", Mode: " + name);
    }
}

export async function screenshot(context, screenshotStep) {
    const page = await getActivePage(context)
   
    const regex = /^([a-zA-Z0-9_.-])+(\.(jpg|jpeg|png|gif|bmp))?$/i;
    const [fileName] = screenshotStep.args;
    const name = fileName.value
    
    const match = name.match(regex);
    if (!match) {
        throw new Error('Invalid file name for screenshot output: ' +
            "Name: " + name);
    }

    let outName = match[1];
    const extension = match[2];
    if (!extension) {
        outName += ".png";
    }

    outName = defaultOutputDir + outName

    await page.screenshot({
        path: outName,
        fullPage: true
    });
}