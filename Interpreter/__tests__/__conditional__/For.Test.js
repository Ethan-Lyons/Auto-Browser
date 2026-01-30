import { test, expect, describe } from '@jest/globals';
import { parseFor, exeFor, routineFor, Routine, handleStep, handleRoutine } from '../../WebHelpers/WebHelpers.js';
import { createForStep, createNewTabStep } from '../StepFactory.js';

describe("parseFor", () => {
  test("parseFor: invalid action", async () => {
    const forStep = { name: "FOO", args: [null] };
    expect(() => parseFor(forStep)).toThrow();
  });

  test("parseFor: valid action", async () => {
    const start = { value: "1" };
    const end = { value: "2" };
    const forStep = { name: "FOR", args: [start, end] };
    const result = parseFor(forStep);
    expect(result).toEqual({ name: "FOR", start: 1, end: 2 });
  });

  //TODO: add tests with variable resolution
});

describe("exeFor", () => {
  test("exeFor: valid loop two", async () => {
    const remainingRoutine = new Routine();

    const forStep = createForStep("1", "2");

    const userNewTab = { name: "USER_ACTION", selected: createNewTabStep() };
    
    const endForStep = { name: "END_FOR", args: [null] };
    const userEndFor = { name: "USER_ACTION", selected: endForStep };

    remainingRoutine.pushManyList([userNewTab, userEndFor]);

    exeFor(remainingRoutine, 2, forStep.name);
    expect(remainingRoutine.getStack().length).toBe(2);
  });

  test("exeFor: valid loop zero", async () => {
    const remainingRoutine = new Routine();

    const forStep = createForStep("1", "2");

    const userNewTab = { name: "USER_ACTION", selected: createNewTabStep() };
    
    const endForStep = { name: "END_FOR", args: [null] };
    const userEndFor = { name: "USER_ACTION", selected: endForStep };

    remainingRoutine.pushManyList([userNewTab, userEndFor]);

    exeFor(remainingRoutine, 0, forStep.name);
    expect(remainingRoutine.getStack().length).toBe(0);
  });
});

describe ("routineFor: handleRoutine, handleStep", () => {
    test("routineFor: valid loop", async () => {
        const remainingRoutine = new Routine();

        const forStep = createForStep("1", "3");
        
        const userNewTab = { name: "USER_ACTIONS", type: "ActionGroup", selected: createNewTabStep() };

        const endForStep = { name: "END_FOR", type: "Action", args: [null] };
        const userEndFor = { name: "USER_ACTIONS", type: "ActionGroup", selected: endForStep };

        remainingRoutine.pushManyList([userNewTab, userEndFor]);

        routineFor(forStep, remainingRoutine);
        expect(remainingRoutine.getStack().length).toBe(2);
    })

    test("handleRoutine: valid loop", async () => {
        const fullRoutine = new Routine();

        const userFor = { name: "USER_ACTIONS", type: "ActionGroup", selected: createForStep("1", "2") };
        
        const endForStep = { name: "END_FOR", type: "Action", args: [null] };
        const userEndFor = { name: "USER_ACTIONS", type: "ActionGroup", selected: endForStep };

        fullRoutine.pushManyList([userFor, userEndFor]);

        handleRoutine(context="", fullRoutine);
        expect(fullRoutine.getStack().length).toBe(0);
    })

    test("routineFor: handleStep simple", async () => {
        const remainingRoutine = new Routine();

        const userFor = { name: "USER_ACTIONS", type: "ActionGroup", selected: createForStep("1", "3") };
        
        const userNewTab = { name: "USER_ACTIONS", type: "ActionGroup", selected: createNewTabStep() };

        const endForStep = { name: "END_FOR", type: "Action", args: [null] };
        const userEndFor = { name: "USER_ACTIONS", type: "ActionGroup", selected: endForStep };

        remainingRoutine.pushManyList([userNewTab, userEndFor]);

        handleStep(context="", userFor, remainingRoutine);
        expect(remainingRoutine.getStack().length).toBe(2);
    })

    test("routineFor: handleStep nested", async () => {
        const remainingRoutine = new Routine();

        const userForOuter = { name: "USER_ACTIONS", type: "ActionGroup", selected: createForStep("0", "2") };

        const userForInner = { name: "USER_ACTIONS", type: "ActionGroup", selected: createForStep("0", "0") };  // 1 * 2 count
        
        const userNewTab = { name: "USER_ACTIONS", type: "ActionGroup", selected: createNewTabStep() };  // 1 * 2 count

        const endForStepInner = { name: "END_FOR", type: "Action", args: [null] };
        const userEndForInner = { name: "USER_ACTIONS", type: "ActionGroup", selected: endForStepInner };   // 1 * 2 count

        const endForStepOuter = { name: "END_FOR", type: "Action", args: [null] };                  
        const userEndForOuter = { name: "USER_ACTIONS", type: "ActionGroup", selected: endForStepOuter };   // Removed after step

        remainingRoutine.pushManyList([userForInner, userNewTab, userEndForInner, userEndForOuter]);

        handleStep(context="", userForOuter, remainingRoutine); // handle outer for loop
        expect(remainingRoutine.getStack().length).toBe(6);
    })
});