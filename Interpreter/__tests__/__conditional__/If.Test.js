import { test, expect, describe } from '@jest/globals';
import { parseIf, exeIf, routineIf, handleStep, Routine} from '../../WebHelpers/WebHelpers.js';

describe("parseIf", () => {
  test("parseIf: invalid action", async () => {
    const ifStep = { name: "FOO", args: [null] };
    expect(() => parseIf(ifStep)).toThrow();
  });

  test("parseIf: valid action", async () => {
    const ifStep = { name: "IF", args: ["condition"] };
    const result = parseIf(ifStep);
    expect(result).toEqual({ name: "IF", condition: "condition" });
  });

});

describe("exeIf", () => {
  test("exeIf: valid action, true", async () => {
    const routine = new Routine();

    const userAction = { name: "USER_ACTION", selected: { name: "BLANK" } };
    const endIfStep = { name: "END_IF", args: [null] };
    const userEndIf = { name: "USER_ACTION", selected: endIfStep };
    
    routine.pushManyList([userAction, userEndIf]);

    exeIf(routine, true, "IF");
    expect(routine.getStack().length).toBe(1);
  });

  test("exeIf: valid action, false", async () => {
    const routine = new Routine();

    const userAction = { name: "USER_ACTION", selected: { name: "BLANK" } };
    const endIfStep = { name: "END_IF", args: [null] };
    const userEndIf = { name: "USER_ACTION", selected: endIfStep };
    
    routine.pushManyList([userAction, userEndIf]);

    exeIf(routine, false, "IF");
    expect(routine.getStack().length).toBe(0);
  });
});

describe("routineIf", () => {
  test("routineIf: handleStep true", async () => {
    const routine = new Routine();
    const condition = { name: "CONDITION", selected: { name: "text", value: "true" } };
    const ifStep = { name: "IF", type: "Action", args: [condition] };

    const userAction = { name: "USER_ACTION", type: "ActionGroup", selected: { name: "BLANK" } };
    const endIfStep = { name: "END_IF", type: "Action", args: [null] };
    const userEndIf = { name: "USER_ACTION", type: "ActionGroup", selected: endIfStep };

    routine.pushManyList([userAction, userEndIf]);
    await handleStep("", ifStep, routine);
    expect(routine.getStack().length).toBe(1);
  });

  test("routineIf: handleStep false", async () => {
    const routine = new Routine();
    const condition = { name: "CONDITION", selected: { name: "text", value: "false" } };
    const ifStep = { name: "IF", type: "Action", args: [condition] };

    const userAction = { name: "USER_ACTION", type: "ActionGroup", selected: { name: "BLANK" } };
    const endIfStep = { name: "END_IF", type: "Action", args: [null] };
    const userEndIf = { name: "USER_ACTION", type: "ActionGroup", selected: endIfStep };

    routine.pushManyList([userAction, userEndIf]);
    await handleStep("", ifStep, routine);
    expect(routine.getStack().length).toBe(0);
  });

  test("routineIf: handleStep nested", async () => {
    const routine = new Routine();

    const outerIf = { name: "IF", type: "Action", args: [{ name: "CONDITION", selected: { name: "text", value: "true" } }] };
    const userIfOuter = { name: "USER_ACTIONS", type: "ActionGroup", selected: outerIf };

    const innerIf = { name: "IF", type: "Action", args: [{ name: "CONDITION", selected: { name: "text", value: "true" } }] };
    const userIfInner = { name: "USER_ACTIONS", type: "ActionGroup", selected: innerIf };

    const userNewTab = { name: "USER_ACTIONS", type: "ActionGroup", selected: { name: "BLANK"} };

    const userEndIfOuter = { name: "USER_ACTIONS", type: "ActionGroup", selected: { name: "END_IF", type: "Action", args: [null] } };

    const userEndIfInner = { name: "USER_ACTIONS", type: "ActionGroup", selected: { name: "END_IF", type: "Action", args: [null] } };

    routine.pushManyList([userIfInner, userNewTab, userEndIfOuter, userEndIfInner]);
    await handleStep("", userIfOuter, routine);
    expect(routine.getStack().length).toBe(3);
  })
});