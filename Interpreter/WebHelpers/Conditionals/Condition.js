import { canFind } from "../FindAlt";
import { assertStep } from "../Assert";
import { resolveBoolean } from "../WebHelpers";

export async function condition(context, conditionStep) {
    const conditionSpec = parseCondition(conditionStep)
    const result = await exeCondition(context, conditionSpec.mode, conditionSpec.step, conditionSpec.value);
    return result;
}

export function parseCondition(conditionStep) {
    assertStep(conditionStep, "CONDITION", "parseCondition");

    const modeStep = conditionStep.selected
    if (!modeStep) {
        throw new Error(`parseCondition: missing selected mode`);
    }

    const modeName = modeStep.name
    if (!modeName) {
        throw new Error(`parseCondition: missing mode name`);
    }
    
    const modeValue = modeStep.value
    if (!modeValue) {
        throw new Error(`parseCondition: missing mode value`);
    }
    
    return { mode: modeName, step: modeStep, value: modeValue };     
}

export async function exeCondition(context, mode, modeStep, value) {
    mode = mode.toUpperCase();
    switch (mode) {
        case "TEXT":
            return resolveBoolean(value);

        case "CAN_FIND":
            return (await canFind(context, modeStep));
                
        default:
            throw new Error(`exeCondition: unsupported condition mode: ${mode}`);
    }
}

