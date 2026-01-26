import { canFind } from "./FindAlt";

export async function condition(context, conditionStep) {
    const conditionSpec = parseCondition(conditionStep)
    result = await exeCondition(context, conditionSpec.mode);
    return result;
}

export async function parseCondition(conditionStep) {
    if (!conditionStep || conditionStep.name?.toUpperCase() !== "CONDITION") {
        throw new Error("parseCondition: input is not a CONDITION step. Input: " + conditionStep);
    }

    const modeStep = conditionStep.selected
    const modeName = modeStep.name.toLowerCase();
    const modeValue = modeStep.value
    
    return { mode: modeName, step: modeStep, value: modeValue };     
}

export async function exeCondition(context, modeName, modeStep, value) {
    switch (modeName) {
        case "text":
            return resolveBoolean(value);

        case "can_find":
            return (await canFind(context, modeStep));
                
        default:
            throw new Error(`exeCondition: unsupported condition mode: ${mode}`);
    }
}

