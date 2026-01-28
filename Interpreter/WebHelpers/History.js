import { getActivePage } from './WebHelpers.js';
import { assertStep } from './Assert.js';

export async function history(context, historyStep) {
    const historySpec = parseHistory(historyStep);
    return await exeHistory(context, historySpec.mode);
}

export function parseHistory(historyStep) {
    assertStep(historyStep, "HISTORY", "parseHistory");

    const [historyMode] = historyStep.args;
    const selectedMode = historyMode.selected;
    const name = selectedMode.name;
    
    return { mode: name };
}

export async function exeHistory(context, mode) {
    mode = mode.toUpperCase();
    const page = await getActivePage(context);
    switch (mode) {
        case "GO_FORWARD":
            await page.goForward();
            break;
        case "GO_BACK":
            await page.goBack();
            break;
        default:
            throw new Error(`exeHistory: unsupported history mode: ${mode}`);
    }
}