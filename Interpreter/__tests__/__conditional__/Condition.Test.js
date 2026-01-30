import { test, expect, describe } from '@jest/globals';
import { parseCondition, condition } from '../../WebHelpers/WebHelpers';
import { conditionStep, textStep} from '../StepFactory';

describe('Condition', () => {
    test('Condition text true', async () => {
        result = await condition(null, conditionStep(textStep("true")));
        expect(result).toBe(true);
    });

    test('Condition text false', async() => {
        result = await condition(null, conditionStep(textStep("false")));
        expect(result).toBe(false);
    });
});

describe('parseCondition', () => {
    test('parseCondition: invalid action', async () => {
        const conditionStep = { name: "FOO", args: [null] };
        expect(() => parseCondition(conditionStep)).toThrow();
    });

    test('parseCondition: valid action', async () => {
        const conStep = conditionStep(textStep("true"));
        const result = parseCondition(conStep);
        expect(result).toEqual({ mode: "text", step: textStep("true"), value: "true" });
    });
});