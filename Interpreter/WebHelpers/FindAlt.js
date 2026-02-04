import { find, getActivePage } from "./WebHelpers.js"
import { TimeoutError } from "puppeteer-core";

export async function canFind(context, canFindStep) {
    findSpec = parseCanFind(canFindStep);
    return await exeCanFind(context, findSpec.findStep);
}

export function parseCanFind(canFindStep) {
    if (!canFindStep || canFindStep.name?.toUpperCase() !== "CAN_FIND") {
        throw new Error(`parseCanFind: input is not a CAN_FIND action.
        Input: ${JSON.stringify(canFindStep)}`);
    }

    const [findStep] = canFindStep.args;
    return { findStep: findStep }
}

export async function exeCanFind(context, findStep) {
    try {
        locator = await find(context, findStep);
        await locator.waitHandle();
    } catch (err) {
        if (err instanceof TimeoutError) {
            return false;
        }
        throw err;
    }
    return true;
}

export async function findText(context, findTextStep) {
    findSpec = parseFindText(findTextStep);
    return await exeFindText(context, findSpec.findStep);
}

export function parseFindText(findTextStep) {
    if (!findTextStep || findTextStep.name?.toUpperCase() !== "FIND_TEXT") {
        throw new Error(`parseFindText: input is not a FIND_TEXT action.
        Input: ${JSON.stringify(findTextStep)}`);
    }

    const [findStep] = findTextStep.args;
    return { findStep: findStep }
}

export async function exeFindText(context, findStep) {
    let elementHandle;
    const page = await getActivePage(context);
    const locator = await find(context, findStep);

    try {
        elementHandle = await locator.waitHandle();
    } catch (err) {
        if (err instanceof TimeoutError) {
            console.warn("Warning (findText): No element found.");
            return "";
        }
        throw err;
    }
    //const elementHandle = await locator.waitHandle();
    const text = await page.evaluate(el => el.textContent, elementHandle);

    return text;
}