import { getActivePage, getActiveIndex } from './WebHelpers.js';
import { getTabCount } from './WebHelpers.js';
import { assertStep } from './Assert.js';

export async function info(context, infoStep) {
    const infoSpec = await parseInfo(infoStep);
    return await exeInfo(context, infoSpec.mode);
}

export async function parseInfo(infoStep) {
    assertStep(infoStep, "INFO", "parseInfo");

    const selected = infoStep.selected;
    const name = selected.name.toLowerCase();
    return { mode: name };
}

export async function exeInfo(context, mode) {
    let page;
    mode = mode.toUpperCase();
    switch (mode) {
        case "URL":
            page = await getActivePage(context);
            return await getUrl(page);

        case "TITLE":
            page = await getActivePage(context);
            return await getTitle(page);

        case "TAB_COUNT":
            return await getTabCount(context);

        case "CURRENT_INDEX":
            return await getActiveIndex(context);

        default:
            throw new Error(`exeInfo: unsupported info mode: ${mode}`);
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