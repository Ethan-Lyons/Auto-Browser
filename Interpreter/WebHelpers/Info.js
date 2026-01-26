import { getActivePage, getActiveIndex } from './WebHelpers.js';
import { getTabCount } from './WebHelpers.js';

export async function info(context, infoStep) {
    const selected = infoStep.selected;
    const name = selected.name.toLowerCase();

    if (name === "url") {
        const page = await getActivePage(context);
        return await getUrl(page);
    }
    else if (name === "title") {
        const page = await getActivePage(context);
        return await getTitle(page);
    }
    else if (name === "tab_count") {
        return await getTabCount(context);
    }
    else if (name === "currentIndex") {
        return await getActiveIndex(context);
    }
    else {
        throw new Error("Unknown info step type recieved. Type: " + name);
    }
}

export async function getUrl(page) {
    const url = await page.url();
    return url;
}

export async function getTitle(page) {
    const title = await page.title();
    return title;
}