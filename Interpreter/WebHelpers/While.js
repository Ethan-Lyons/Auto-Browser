import { resolveBoolean } from "./StoreVariables.js";

// TODO: check if can_find can just be put under resolveBoolean and be used for general (maybe a bool file)

export function routineWhile(whileStep, routine) {
    whileSpec = parseWhile(whileStep)
    exeWhile(routine, whileSpec.condition, whileStep)
}

export function parseWhile(whileStep) {
    let [condition] = whileStep.args;
    const value = condition.selected.value;
    const whileName = whileStep.name;

    condition = resolveBoolean(value);  // Resolve value to boolean

    return { name: whileName, condition: condition }
}

export async function exeWhile(routine, condition, whileStep) {
    // Block contains:
    //  body: actions to execute
    //  bodyPost: empty
    //  end: end marker
    const block = routine.popControlBlock(whileStep.name);

    if (condition){
        // Push actions to execute
        routine.pushManyStack(block.body);  

        // Duplicate original while structure to loop again
        routine.push(block.end);
        routine.pushManyStack(block.body);
        routine.push(whileStep)
    }
}