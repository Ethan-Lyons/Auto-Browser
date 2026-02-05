import { test, expect, describe } from '@jest/globals';
import { Routine } from '../WebHelpers/Routine.js';
import { getVariableValue } from '../WebHelpers/StoreVariables.js';
import { handleStep } from '../WebHelpers/StepsHandler.js';
import { store, parseStore, exeStore, parseStorable, parseVar, storeText} from '../WebHelpers/Store.js'
import { storableGroupStep, storableStep, variableStep, storeStep } from '../StepFactory.js';

describe("parse store", () => {
  test("parseStore: invalid action", async () => {
    const fakeStep = { name: "FOO", args: [null] };
    expect(() => parseStore(fakeStep)).toThrow();
  });

  test("parseStore: valid action", async () => {
    const sStep = storeStep("modeName", "modeValue", "varName")
    const storeSpec = parseStore(sStep)
    expect(storeSpec).toEqual({ name: "STORE", mode: "modeName",
        step: storableStep("modeName", "modeValue"), storeName: "varName"});
  });
});

describe("parse store: validating storable args", () => {
  test("parseStorable: invalid action", async () => {
    const fakeStep = { name: "FOO", selected: null};
    expect(() =>parseStorable(fakeStep)).toThrow();
  });

  test("parseStorable: valid action", async () => {
    const storable = storableGroupStep("modeName", "modeValue")
    const storableSpec = parseStorable(storable)
    expect(storableSpec).toEqual({ mode: "modeName", step: storableStep("modeName", "modeValue")});
  });

  test("parseVar: invalid action", async () => {
    const fakeStep = { name: "FOO", args: [null] };
    expect(() =>parseVar(fakeStep)).toThrow();
  });

  test("parseVar: valid action", async () => {
    const varStep = variableStep("varName")
    const varSpec = parseVar(varStep)
    expect(varSpec).toEqual({ value: "varName"});
  });
});

describe("store: text", () => {
  test("store: valid mode", async () => {
    const expectedValue = "modeValue";
    const expectedName = "varName";
    const sStep = storeStep("text", expectedValue, expectedName)
    await store("context", sStep);

    const recieved = await getVariableValue(expectedName);
    expect(recieved).toBe(expectedValue);
  });

  test("store: invalid mode", async () => {
    const expectedValue = "modeValue";
    const expectedName = "varName";
    const sStep = storeStep("FOO", expectedValue, expectedName)
    await expect(store("context", sStep)).rejects.toThrow();
  });

  test("store: handleStep", async () => {
    const expectedValue = "modeValue";
    const expectedName = "varName";
    const routine = new Routine();
    const sStep = storeStep("text", expectedValue, expectedName)
    
    routine.pushManyList([]);
    await handleStep("context", sStep, routine);
    expect(routine.getStack().length).toBe(0);
    const recieved = await getVariableValue(expectedName);
    expect(recieved).toBe(expectedValue);
  });
});