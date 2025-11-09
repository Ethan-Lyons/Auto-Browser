import * as WebHelpers from '../WebHelpers/WebHelpers.js';  
//import assert from 'assert';

test('connectToBrowser', async () => {
    try {
        browser = await WebHelpers.connectToBrowser();
        await WebHelpers.disconnect(browser);
    } catch (err) {
        console.error('Error connecting to Puppeteer:\n', err);
        process.exit(1);
    }
});


/*async function main() {
    const newBrowser = await WebHelpers.connectToBrowser();
    try {
        let urlArg;
        let navStep;
        urlArg = {      //also assuming i have a py program which can generate this, how can i use those methods in this js script? or should i?
            type: 'Argument',
            name: 'url',
            value: 'google.com',
            description: ''
        }
        navStep = {
                    type: 'Action',
                    name: 'URL_NAV',
                    args: [urlArg],
                    description: 'Go to URL'
                }

        await WebHelpers.urlNav(newBrowser, navStep);
        const currentUrl = await WebHelpers.getCurrentUrl(newBrowser);
        //assert.equal(currentUrl, 'https://www.google.com/');    
    } catch (err) {
        console.error('Error disconnecting from Puppeteer:\n', err);
        process.exit(1);
    } finally {
        await WebHelpers.disconnect(newBrowser);
    }
}

main()
*/