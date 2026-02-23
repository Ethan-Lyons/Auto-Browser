import { test, expect, describe } from '@jest/globals';
import { parseCondition, condition } from '../../WebHelpers/WebHelpers';
import { conditionStep, textStep} from '../../StepFactory';

describe('Condition', () => {
    test('Condition string, true', async () => {
        const result = await condition(null, conditionStep(textStep("true")));
        expect(result).toBe(true);
    });

    test('Condition string, false', async() => {
        const result = await condition(null, conditionStep(textStep("false")));
        expect(result).toBe(false);
    });
});

describe('parseCondition', () => {
    test('parseCondition: invalid action', async () => {
        const fakeStep = { name: "FOO", args: [null] };
        expect(() => parseCondition(fakeStep)).toThrow();
    });

    test('parseCondition: valid action', async () => {
        const conStep = conditionStep(textStep("true"));
        const result = parseCondition(conStep);
        expect(result).toEqual({ mode: "TEXT", step: textStep("true")});
    });
});