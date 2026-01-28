import { defaultOutputDir, getActivePage } from './WebHelpers.js';

export async function screenshot(context, screenshotStep) {
    const page = await getActivePage(context);
   
    const regex = /^([a-zA-Z0-9_.-])+(\.(jpg|jpeg|png|gif|bmp))?$/i;
    const [fileName] = screenshotStep.args;
    const name = fileName.value;
    
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

    outName = defaultOutputDir + outName;

    await page.screenshot({
        path: outName,
        fullPage: true
    });
}