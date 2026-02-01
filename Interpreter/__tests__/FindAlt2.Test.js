import { Routine, getBrowser, getContext, newTab, urlNav } from '../WebHelpers/WebHelpers.js';
import { parseCanFind, parseFindText, exeCanFind, exeFindText, parseFind, findText } from '../WebHelpers/WebHelpers.js';
import { test, expect } from '@jest/globals';
import { urlStep, findStep, argumentStep, urlNavStep, newTabStep, canFindStep, findTextStep } from './StepFactory.js';

describe("parseCanFind", () => {
  test("parseCanFind: invalid action", async () => {
      const fakeStep = { name: "FOO", args: [null] };
      expect(() =>parseCanFind(fakeStep)).toThrow();
  });

  test("parseCanFind: valid action", async () => {
      const cfStep = canFindStep(findStep(argumentStep("text", "example.com")));
      const cfSpec = parseCanFind(cfStep)
      expect(cfSpec).toEqual({ findStep: findStep(argumentStep("text", "example.com"))});
  });
});

describe("exeCanFind", () => {
  test("exeCanFind: invalid action", async () => {
    
  });

  test("exeCanFind: valid action", async () => {
    
  });
});

describe("canFind", () => {
  test("canFind: invalid action", async () => {
    
  });

  test("canFind: valid action", async () => {
    
  });
});

describe("parseFindText", () => {
  test("parseFindText: invalid action", async () => {
      const fakeStep = { name: "FOO", args: [null] };
      expect(() =>parseFindText(fakeStep)).toThrow();
  });

  test("parseFindText: valid action", async () => {
      const ftStep = findTextStep(findStep(argumentStep("text", "example.com")));
      const ftSpec = parseFindText(ftStep)
      expect(ftSpec).toEqual({ findStep: findStep(argumentStep("text", "example.com"))});
  });
});

describe("exeFindText", () => {
  test("exeFindText: invalid action", async () => {
    
  });

  test("exeFindText: valid action", async () => {
    
  });
});

describe("FindText", () => {
  test("FindText: invalid action", async () => {
    
  });

  test("FindText: valid action", async () => {
    
  });
});

