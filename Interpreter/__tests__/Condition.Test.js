import { test, expect, describe } from '@jest/globals';
import { parseCondition, condition } from '../WebHelpers/WebHelpers';

describe('Condition', () => {
    test('Condition text true', async () => {
        result = await condition(null, { name: "CONDITION", selected: { name: "text", value: "true" } });
        expect(result).toBe(true);
    });

    test('Condition text false', async() => {
        result = await condition(null, { name: "CONDITION", selected: { name: "text", value: "false" } });
        expect(result).toBe(false);
    });
});

describe('parseCondition', () => {
    test('parseCondition: invalid action', async () => {
        const conditionStep = { name: "FOO", args: [null] };
        expect(() => parseCondition(conditionStep)).toThrow();
    });

    test('parseCondition: valid action', async () => {
        const conditionStep = { name: "CONDITION", selected: { name: "text", value: "true" } };
        const result = parseCondition(conditionStep);
        expect(result).toEqual({ mode: "text", step: { name: "text", value: "true" }, value: "true" });
    });
});