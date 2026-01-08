import { getActivePage } from './WebHelpers.js';
import { getTabCount } from './WebHelpers.js';

export async function info(context, infoStep) {
    const infoSelect = infoStep.args[0]
    const selectedStep = infoSelect.selected
    const name = selectedStep.name
    if (name == "url"){
        return await contextToUrl(context)
    }
    else if (name == "tab_num"){
        return await getTabCount(context)
    }
    else {
        throw new Error("Unknown info step type recieved. Type: " + name);
    }
}

export async function getUrl(page) {
    const url = await page.url();
    return url;
}
export async function contextToUrl(context) {
    const page = await getActivePage(context);
    return await getUrl(page);
}