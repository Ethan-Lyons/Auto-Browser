export async function getTabs(page) {
    const tabs = await page.tabs();
    return tabs;
}

export async function closeTab(browser, tab) {
    try {
        await browser.closeTab(tab);       // Find real function
    } catch (err) {
        console.error('Navigation (closeTab) error:\n', err);
        process.exit(1);
    }
}

async function openTabIndex(browser, index) {
    try {
        tabs = browser.pages();
        await browser.bringToFront(tabs[index]);
    } catch (err) {
        console.error('Navigation (openTabIndex) error:\n', err);
        process.exit(1);
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
        console.error('Navigation (navToTab) error:\n', err);
        process.exit(1);
    }
}

export async function newTab(browser) {
    try {
        await browser.newPage();       // Find real function
    } catch (err) {
        console.error('Navigation (newTab) error:\n', err);
        process.exit(1);
    }
}