import { assertStep } from "./Assert";
import { getActivePage, find } from "./WebHelpers";

export async function typeText(typeTextStep) {
    const typeTextSpec = parseTypeText(typeTextStep);

    const locator = await find(context, typeTextSpec.findStep);
    const page = await getActivePage(context);
    page.focus()
    await exeTypeText(context, locator, typeTextSpec.text, delay);
}

export function parseTypeText(typeTextStep) {
    assertStep(typeTextStep, "TYPE_TEXT", "parseTypeText");

    const [findStep, text, milliseconds] = typeTextStep.args;
    assertStep(text, "TEXT", "parseTypeText");
    assertStep(milliseconds, "MILLISECONDS", "parseTypeText");

    return { findStep: findStep, text: text, delay: milliseconds };
}

export async function exeTypeText(context, text, delay) {
    const delay = Math.max(0, delay || 0);
    const page = await getActivePage(context);

    await page.keyboard.type(text, { delay: delay });
}