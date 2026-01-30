import { test, expect, describe } from '@jest/globals';
import { parseIf, exeIf, routineIf, handleStep, Routine} from '../../WebHelpers/WebHelpers.js';
import { ifStep, elseStep, endIfStep, userAction, conditionStep, blankStep, textStep } from '../StepFactory.js';

describe("parseIf", () => {
  test("parseIf: invalid action", async () => {
    const iStep = { name: "FOO", args: [null] };
    expect(() => parseIf(iStep)).toThrow();
  });

  test("parseIf: valid action", async () => {
    const iStep = ifStep(conditionStep(blankStep()));
    const result = parseIf(iStep);
    expect(result).toEqual({ name: "IF", condition: conditionStep(blankStep()) });
  });

});

describe("exeIf", () => {
  test("exeIf: valid action, true", async () => {
    const routine = new Routine();

    const userBlank = userAction(blankStep());
    const userEndIf = userAction(endIfStep());
    
    routine.pushManyList([userBlank, userEndIf]);

    exeIf(routine, true, "IF");
    expect(routine.getStack().length).toBe(1);
  });

  test("exeIf: valid action, false", async () => {
    const routine = new Routine();

    const userBlank = userAction(blankStep());
    const userEndIf = userAction(endIfStep());
    
    routine.pushManyList([userBlank, userEndIf]);

    exeIf(routine, false, "IF");
    expect(routine.getStack().length).toBe(0);
  });
});

describe("routineIf", () => {
  test("routineIf: handleStep true", async () => {
    const routine = new Routine();
    const iStep = ifStep(conditionStep(textStep("true")));
    const userBlank = userAction(blankStep());
    const userEndIf = userAction(endIfStep());
    
    routine.pushManyList([userBlank, userEndIf]);

    await handleStep("", iStep, routine);
    expect(routine.getStack().length).toBe(1);
  });

  test("routineIf: handleStep false", async () => {
    const routine = new Routine();
    const iStep = ifStep(conditionStep(textStep("false")));
    const userBlank = userAction(blankStep());
    const userEndIf = userAction(endIfStep());
    
    routine.pushManyList([userBlank, userEndIf]);

    await handleStep("", iStep, routine);
    expect(routine.getStack().length).toBe(0);
  });

  test("routineIf: handleStep nested", async () => {
    const routine = new Routine();

    const outerCon = conditionStep(textStep("true"));
    const userIfOuter = userAction(ifStep(outerCon));

    const innerCon = conditionStep(textStep("true"));
    const userIfInner = userAction(ifStep(innerCon));

    const userBlank = userAction(blankStep());

    const userEndIfOuter = userAction(endIfStep());
    const userEndIfInner = userAction(endIfStep());

    routine.pushManyList([userIfInner, userBlank, userEndIfOuter, userEndIfInner]);
    await handleStep("", userIfOuter, routine);
    expect(routine.getStack().length).toBe(3);
  })
});