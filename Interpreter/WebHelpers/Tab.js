export async function getTabs(browser) {
    const tabs = await browser.pages();
    return tabs;
}

export async function closeTab(browser, tab) {
    try {
        await browser.closeTab(tab);       // Find real function
    } catch (err) {
        throw new Error('Navigation (closeTab) error:\n' + err);
    }
}

async function openTabIndex(browser, index) {
    try {
        tabs = browser.pages();
        await browser.bringToFront(tabs[index]);
    } catch (err) {
        throw new Error('Navigation (openTabIndex) error:\n' + err);
    }
}

export async function navToTab(browser, action) {
    try {
        tab = action.tab;
        if (typeof tab == int) {
            await browser.navigateToTab(action);       // Find real function
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
        
    } catch (err) {
        throw new Error('Navigation (navToTab) error:\n' + err);
    }
}

export async function newTab(browser) {
    try {
        await browser.newPage();
    } catch (err) {
        throw new Error('Navigation (newTab) error:\n' + err);
    }
}