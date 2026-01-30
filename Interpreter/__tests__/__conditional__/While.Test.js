import { test, expect, describe } from '@jest/globals';
import { parseWhile, exeWhile, routineWhile, handleStep, Routine } from '../../WebHelpers/WebHelpers.js';
import { userAction, endWhileStep, whileStep, conditionStep, textStep } from '../StepFactory.js';

describe("parseWhile", () => {
    test("parseWhile: invalid action", async () => {
        const wStep = { name: "FOO", args: [null] };
        expect(() => parseWhile(wStep)).toThrow();
    });

    test("parseWhile: valid action", async () => {
        const condition = conditionStep(textStep("true"));
        const wStep = whileStep(condition);
        const result = parseWhile(wStep);
        expect(result).toEqual({ name: "WHILE", condition: conditionStep(textStep("true")) });
    });
});

describe("exeWhile", () => {
    test("exeWhile: invalid action", async () => {
        const routine = new Routine();
        const wStep = { name: "FOO", args: [null] };
        routine.push(wStep);
        await expect(exeWhile(routine, true, wStep)).rejects.toThrow();
    });

    test("exeWhile: valid action empty true", async () => {
        const routine = new Routine();
        const wStep = whileStep(conditionStep(textStep("true")));
        const userEndWhile = userAction(endWhileStep());

        routine.pushManyList([userEndWhile]);
        await exeWhile(routine, true, wStep);
        expect(routine.getStack().length).toBe(0);
    });

    test("exeWhile: valid action empty false", async () => {
        const routine = new Routine();
        const wStep = whileStep(conditionStep(textStep("false")));
        const userEndWhile = userAction(endWhileStep());

        routine.pushManyList([userEndWhile]);
        await exeWhile(routine, false, wStep);
        expect(routine.getStack().length).toBe(0);
    });
});

describe("routineWhile", () => {
    test("routineWhile: handleStep true", async () => {
        const routine = new Routine();
        const wStep = whileStep(conditionStep(textStep("true")));
        const userEndWhile = userAction(endWhileStep());
        const userBlank = userAction({ name: "BLANK" });

        routine.pushManyList([userBlank, userEndWhile]);
        await handleStep("", wStep, routine);
        expect(routine.getStack().length).toBe(4);  // 1 blank + 3 for repeated while block
    });

    test("routineWhile: handleStep false", async () => {
        const routine = new Routine();
        const wStep = whileStep(conditionStep(textStep("false")));
        const userEndWhile = userAction(endWhileStep());
        const userBlank = userAction({ name: "BLANK" });

        routine.pushManyList([userBlank, userEndWhile]);
        await handleStep("", wStep, routine);
        expect(routine.getStack().length).toBe(0);
    });
});