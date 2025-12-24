//import { setActivePage } from "./WebHelpers";

export async function getTabs(browser) {
    const tabs = await browser.pages();
    return tabs;
}

export async function closeTab(browser, tab) {
    try {
        await browser.closeTab(tab);
    } catch (err) {
        throw new Error('Navigation (closeTab) error:\n' + err);
    }
}

async function openTabIndex(context, index) {
    try {
        tabs = context.pages();
        await context.bringToFront(tabs[index]);
        setActivePage(context, tabs[index]);
    } catch (err) {
        throw new Error('Navigation (openTabIndex) error:\n' + err);
    }
}

// TODO: redo this whole thing, make sure active page is set correctly
export async function navToTab(browser, navAction) {
    try {
        tab = navAction.tab;
        if (typeof tab == int) {
            await browser.navigateToTab(navAction);       // Find real function
        }
        else if (typeof tab == str) {
            activeIndex = await getActiveIndex(browser);
            if (tab == "new") {
                await newTab(browser);
            }
            else if (tab == "previous") {
                index = Math.max(0, activeIndex - 1);
            }
            else if (tab == "next") {
                //await page.navigateToTab(tab);       // Find real function
                index = Math.min(tabs.length - 1, activeIndex + 1);
            }
            else if (tab == "last") {
                index = tabs.length - 1;
            }
            else if (tab == "first") {
                index = 0;
                
            }
            openTabIndex(browser, index);
        }
        setActivePage(context, tabs[index]);
        
    } catch (err) {
        throw new Error('Navigation (navToTab) error:\n' + err);
    }
}

export async function newTab(browser) {
    try {
        page = await browser.newPage();
        setActivePage(context, page);
    } catch (err) {
        throw new Error('Navigation (newTab) error:\n' + err);
    }
}