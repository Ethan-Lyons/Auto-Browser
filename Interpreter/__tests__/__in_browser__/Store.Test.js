import { test, expect, describe } from '@jest/globals';
import { Routine } from '../WebHelpers/Routine.js';
import { getVariableValue } from '../WebHelpers/StoreVariables.js';
import { handleStep } from '../WebHelpers/StepsHandler.js';
import { store, parseStore, exeStore, parseStorable, parseVar, storeFindText, storeInfo, storeText} from '../WebHelpers/Store.js'
import { createStorableGroup, createStorableStep, createVariableStep, createStoreStep } from './StepFactory.js';

describe("storeFindText: invalid", () => {
  test("parseStore: invalid action", async () => {
    //const fakeStep = { name: "FOO", args: [null] };
    //expect(() => parseStore(fakeStep)).toThrow();
  });

  test("storeFindText: valid action", async () => {
    //const storeStep = createStoreStep("modeName", "modeValue", "varName")
    //const storeSpec = parseStore(storeStep)
    //expect(storeSpec).toEqual({ name: "STORE", mode: "modeName",
       // step: createStorableStep("modeName", "modeValue"), storeName: "varName"});
  });
});

describe("storeInfo: ", () => {
  test("parseStorable: invalid action", async () => {
    const fakeStep = { name: "FOO", selected: null};
    expect(() =>parseStorable(fakeStep)).toThrow();
  });

  test("parseStorable: valid action", async () => {
    const storable = createStorableGroup("modeName", "modeValue")
    const storableSpec = parseStorable(storable)
    expect(storableSpec).toEqual({ mode: "modeName", step: createStorableStep("modeName", "modeValue")});
  });

  test("parseVar: invalid action", async () => {
    const fakeStep = { name: "FOO", args: [null] };
    expect(() =>parseVar(fakeStep)).toThrow();
  });

  test("parseVar: valid action", async () => {
    const varStep = createVariableStep("varName")
    const varSpec = parseVar(varStep)
    expect(varSpec).toEqual({ value: "varName"});
  });
});

describe("store: text", () => {
  test("store", async () => {
    const expectedValue = "modeValue";
    const expectedName = "varName";
    const storeStep = createStoreStep("text", expectedValue, expectedName)
    await store("context", storeStep);

    const recieved = await getVariableValue(expectedName);
    expect(recieved).toBe(expectedValue);
  });

  test("store: invalid mode", async () => {
    const expectedValue = "modeValue";
    const expectedName = "varName";
    const storeStep = createStoreStep("FOO", expectedValue, expectedName)
    await expect(store("context", storeStep)).rejects.toThrow();
  });

  test("store: handleStep", async () => {
    const expectedValue = "modeValue";
    const expectedName = "varName";
    const routine = new Routine();
    const storeStep = createStoreStep("text", expectedValue, expectedName)
    
    routine.pushManyList([]);
    await handleStep("context", storeStep, routine);
    expect(routine.getStack().length).toBe(0);
    const recieved = await getVariableValue(expectedName);
    expect(recieved).toBe(expectedValue);
  });
});