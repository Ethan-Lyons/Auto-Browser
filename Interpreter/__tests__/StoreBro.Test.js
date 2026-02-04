import { test, expect, describe } from '@jest/globals';
import { Routine } from '../WebHelpers/Routine.js';
import { getVariableValue } from '../WebHelpers/StoreVariables.js';
import { handleStep } from '../WebHelpers/StepsHandler.js';
import { store, parseStore, exeStore, parseStorable, parseVar, storeFindText, storeInfo, storeText} from '../WebHelpers/Store.js'
import { storableGroupStep, storableStep, variableStep, storeStep } from '../StepFactory.js';
import * as WebHelpers from '../WebHelpers/WebHelpers.js';

let browser;
let context;

beforeAll(async () => {
    try {
        browser = await WebHelpers.getBrowser();
    } catch (err) {
        console.error('Error connecting to Puppeteer:\n', err);
        process.exit(1);
    }
});

beforeEach(async () => {
    context = await WebHelpers.getContext(browser, true);
});

afterEach(async () => {
    await context.close();
});

afterAll(async () => {
    await WebHelpers.browserDisconnect(browser);
});

//storeFindText, storeInfo, storeText

describe('storeFindText', () => {
    test('storeFindText', async () => {
        //const storeStep = createStoreStep("modeName", "modeValue", "varName")
        //const storeSpec = parseStore(storeStep)
        //expect(storeSpec).toEqual({ name: "STORE", mode: "modeName",
        //    step: createStorableStep("modeName", "modeValue"), storeName: "varName"});
    });
});