import { test, expect } from '@jest/globals';
import { findStep, argumentStep, canFindStep, findTextStep } from '../../StepFactory.js';

import { getBrowser, getContext, browserDisconnect, newTab,
    getActiveIndex, getTabs, getActivePage, exeUrlNav } from '../../WebHelpers/WebHelpers.js';
import { parseCanFind, parseFindText, exeCanFind, exeFindText, canFind, findText } from '../../WebHelpers/WebHelpers.js';

let browser;
let context;

beforeAll(async () => {
    try {
        browser = await getBrowser();
    } catch (err) {
        console.error('Error connecting to Puppeteer:\n', err);
        process.exit(1);
    }
});

beforeEach(async () => {
    context = await getContext(browser, true);
    await newTab(context);
    await exeUrlNav(context, "example.com");
});

afterEach(async () => {
    await context.close();
});

afterAll(async () => {
    await browserDisconnect(browser);
});


describe("parseCanFind", () => {
  test("parseCanFind: invalid action", async () => {
      const fakeStep = { name: "FOO", args: [null] };
      expect(() =>parseCanFind(fakeStep)).toThrow();
  });

  test("parseCanFind: valid action", async () => {
      const cfStep = canFindStep(findStep(argumentStep("text", "example text")));
      const cfSpec = parseCanFind(cfStep)
      expect(cfSpec).toEqual({ findStep: { name: "FIND", type: "ActionGroup", selected: argumentStep("text", "example text")} });
  });
});

describe("parseFindText", () => {
  test("parseFindText: invalid action", async () => {
      const fakeStep = { name: "FOO", args: [null] };
      expect(() =>parseFindText(fakeStep)).toThrow();
  });

  test("parseFindText: valid action", async () => {
      const ftStep = findTextStep(findStep(argumentStep("text", "example text")));
      const ftSpec = parseFindText(ftStep)
      expect(ftSpec).toEqual({ findStep: { name: "FIND", type: "ActionGroup", selected: argumentStep("text", "example text")} });
  });
});

describe("exeCanFind", () => {
  test("exeCanFind: valid action, true", async () => {
    const fStep = findStep(argumentStep("text", "Learn more"));
    const resultBool = await exeCanFind(context, fStep)
    expect(resultBool).toEqual(true);
  });

  test("exeCanFind: valid action, partial match", async () => {
    const fStep = findStep(argumentStep("text", "Learn"));
    const resultBool = await exeCanFind(context, fStep)
    expect(resultBool).toEqual(true);
  });

  test("exeCanFind: valid action, false", async () => {
    const fStep = findStep(argumentStep("text", "foobar"));
    const resultBool = await exeCanFind(context, fStep)
    expect(resultBool).toEqual(false);
  });
});

describe("exeFindText", () => {
  test("exeFindText: valid action, found", async () => {
    const fStep = findStep(argumentStep("text", "Learn more"));
    const resultText = await exeFindText(context, fStep)
    expect(resultText).toEqual("Learn more");
  });

  test("exeFindText: valid action, partial match", async () => {
    const fStep = findStep(argumentStep("text", "Learn"));
    const resultText = await exeFindText(context, fStep)
    expect(resultText).toEqual("Learn more");
  });

  test("exeFindText: valid action, not found", async () => {
    const fStep = findStep(argumentStep("text", "foobar"));
    const resultText = await exeFindText(context, fStep)
    expect(resultText).toEqual("");
  });
});

describe("canFind", () => {
  test("canFind: valid action", async () => {
    const cfStep = canFindStep(findStep(argumentStep("text", "Learn more")));
    const resultBool = await canFind(context, cfStep)
    expect(resultBool).toEqual(true);
  });
});

describe("FindText", () => {
  test("FindText: valid action", async () => {
    const ftStep = findTextStep(findStep(argumentStep("text", "Learn more")));
    const resultText = await findText(context, ftStep)
    expect(resultText).toEqual("Learn more");
  });
});

