import { test, expect, describe } from '@jest/globals';
import { parseWhile, exeWhile } from '../WebHelpers/While.js';
import { handleStep } from '../WebHelpers/StepsHandler.js';
import { Routine } from '../WebHelpers/Routine.js';

function userAction(step) {
    return { name: "USER_ACTION", type: "ActionGroup", selected: step };
}

function endWhile() {
    return { name: "END_WHILE", type: "Action", args: [null] };
}

describe("parseWhile", () => {
    test("parseWhile: invalid action", async () => {
        const whileStep = { name: "FOO", args: [null] };
        expect(() => parseWhile(whileStep)).toThrow();
    });

    test("parseWhile: valid action", async () => {
        const condition = { name: "CONDITION", selected: { name: "text", value: "true" } };
        const whileStep = { name: "WHILE", args: [condition] };
        const result = parseWhile(whileStep);
        expect(result).toEqual({ name: "WHILE", condition: condition });
    });
});

describe("exeWhile", () => {
    test("exeWhile: invalid action", async () => {
        const routine = new Routine();
        const whileStep = { name: "FOO", args: [null] };
        routine.push(whileStep);
        await expect(exeWhile(routine, true, whileStep)).rejects.toThrow();
    });

    test("exeWhile: valid action empty true", async () => {
        const routine = new Routine();
        const condition = { name: "CONDITION", selected: { name: "text", value: "true" } };
        const whileStep = { name: "WHILE", args: [condition] };

        const endWhileStep = { name: "END_WHILE", type: "Action", args: [null] };
        const userEndWhile = userAction(endWhileStep);
        routine.pushManyList([userEndWhile]);

        await exeWhile(routine, true, whileStep);
        expect(routine.getStack().length).toBe(0);
    });

    test("exeWhile: valid action empty false", async () => {
        const routine = new Routine();
        const condition = { name: "CONDITION", selected: { name: "text", value: "false" } };
        const whileStep = { name: "WHILE", args: [condition] };

        const userEndWhile = userAction(endWhile());
        routine.pushManyList([userEndWhile]);

        await exeWhile(routine, false, whileStep);
        expect(routine.getStack().length).toBe(0);
    });
});

describe("routineWhile", () => {
    test("routineWhile: handleStep true", async () => {
        const routine = new Routine();
        const condition = { name: "CONDITION", selected: { name: "text", value: "true" } };
        const whileStep = { name: "WHILE", type: "Action", args: [condition] };

        const blankUA = userAction({ name: "BLANK" });
        const userEndWhile = userAction(endWhile());

        routine.pushManyList([blankUA, userEndWhile]);
        await handleStep("", whileStep, routine);
        expect(routine.getStack().length).toBe(4);  // 1 blank + 3 for repeated while block
    });

    test("routineWhile: handleStep false", async () => {
        const routine = new Routine();
        const condition = { name: "CONDITION", selected: { name: "text", value: "false" } };
        const whileStep = { name: "WHILE", type: "Action", args: [condition] };

        const blankUA = userAction({ name: "BLANK" });
        const userEndWhile = userAction(endWhile());

        routine.pushManyList([blankUA, userEndWhile]);
        await handleStep("", whileStep, routine);
        expect(routine.getStack().length).toBe(0);
    });
});