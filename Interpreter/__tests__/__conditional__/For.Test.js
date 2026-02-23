import { test, expect, describe, beforeAll, beforeEach, afterEach, afterAll } from '@jest/globals';

import { parseFor, exeFor, routineFor, Routine, handleStep,
  handleRoutine } from '../../WebHelpers/WebHelpers.js';
  
import { newTabStep, endForStep, forStep, userAction } from '../../StepFactory.js';

describe("parseFor", () => {
  test("parseFor: invalid action", async () => {
    const fakeStep = { name: "FOO", args: [null] };
    expect(() => parseFor(fakeStep)).toThrow();
  });

  test("parseFor: valid action", async () => {
    const fStep = forStep("1", "2");
    const result = parseFor(fStep);
    expect(result).toEqual({ name: "FOR", start: "1", end: "2"});
  });
});

describe("exeFor", () => {
  test("exeFor: valid loop two", async () => {
    const remainingRoutine = new Routine();

    const fStep = forStep("1", "2");

    const userNewTab = userAction(newTabStep());
    const userEndFor = userAction(endForStep());

    remainingRoutine.pushManyList([userNewTab, userEndFor]);

    exeFor(remainingRoutine, 2, fStep.name);
    expect(remainingRoutine.getStack().length).toBe(2);
  });

  test("exeFor: valid loop zero", async () => {
  const remainingRoutine = new Routine();

  const fStep = forStep("1", "2");

  const userNewTab = userAction(newTabStep());
  const userEndFor = userAction(endForStep());

  remainingRoutine.pushManyList([userNewTab, userEndFor]);

  exeFor(remainingRoutine, 0, fStep.name);
  expect(remainingRoutine.getStack().length).toBe(0);
  });
});

describe ("routineFor: handleRoutine, handleStep", () => {
    test("routineFor: valid loop", async () => {
        const remainingRoutine = new Routine();

        const fStep = forStep("1", "3");
        
        const userNewTab = userAction(newTabStep());
        const userEndFor = userAction(endForStep());

        remainingRoutine.pushManyList([userNewTab, userEndFor]);

        routineFor(fStep, remainingRoutine);
        expect(remainingRoutine.getStack().length).toBe(2);
    })

    test("handleRoutine: valid loop", async () => {
        const routine = new Routine();

        const userFor = forStep("1", "2");
        const userEndFor = userAction(endForStep());

        routine.pushManyList([userFor, userEndFor]);
        handleRoutine(context="", routine);
        expect(routine.getStack().length).toBe(0);
    })

    test("routineFor: handleStep simple", async () => {
        const remainingRoutine = new Routine();

        const userFor = userAction(forStep("1", "3"));
        const userNewTab = userAction(newTabStep());
        const userEndFor = userAction(endForStep());

        remainingRoutine.pushManyList([userNewTab, userEndFor]);

        handleStep(context="", userFor, remainingRoutine);
        expect(remainingRoutine.getStack().length).toBe(2);
    })

    test("routineFor: handleStep nested", async () => {
        const remainingRoutine = new Routine();

        const userForOuter = userAction(forStep("0", "2"));
        const userForInner = userAction(forStep("0", "0")); // 1 * 2 count
        
        const userNewTab = userAction(newTabStep());  // 1 * 2 count

        const userEndForInner = userAction(endForStep());   // 1 * 2 count
        const userEndForOuter = userAction(endForStep());   // Removed after step

        remainingRoutine.pushManyList([userForInner, userNewTab, userEndForInner, userEndForOuter]);

        handleStep(context="", userForOuter, remainingRoutine); // handle outer for loop
        expect(remainingRoutine.getStack().length).toBe(6);
    })
});