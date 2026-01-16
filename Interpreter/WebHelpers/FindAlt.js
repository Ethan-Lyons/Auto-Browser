import { find, getActivePage } from "./WebHelpers.js"

export async function canFind(context, canFindStep) {
    const [findStep] = canFindStep.args;
    try {
        await find(context, findStep);
    } catch (err) {
        if (err.code === 'TimeoutError') {
            return false;
        }
        throw err;
    }
    return true;
}

export async function findText(context, findTextStep) {
    const [findStep] = findTextStep.args;
    const page = await getActivePage(context);

    const locator = await find(context, findStep);

    const elementHandle = await locator.waitHandle();
    const text = await page.evaluate(el => el.textContent, elementHandle);

    return text;
}