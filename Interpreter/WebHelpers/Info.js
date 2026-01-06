import { getActivePage } from './WebHelpers.js';
export async function info(infoAction) {
    console.log("METHOD NOT IMPLEMENTED")
}

export async function getUrl(page) {
    const url = await page.url();
    return url;
}
export async function contextToUrl(context) {
    const page = await getActivePage(context);
    return await getUrl(page);
}