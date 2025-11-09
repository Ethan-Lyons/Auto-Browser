import { getActivePage } from './WebHelpers.js';
export async function getCurrentUrl(browser) {
    const page = await getActivePage(browser);
    const currentUrl = await page.url();
    return currentUrl;
}