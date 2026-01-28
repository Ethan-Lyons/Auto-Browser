import { condition } from "./Condition";
import { assertStep } from "./Assert";

export async function routineWhile(context, whileStep, routine) {
    whileSpec = parseWhile(whileStep);
    conResult = await condition(context, whileSpec.condition)
    exeWhile(routine, whileSpec.condition, whileStep)
}

export function parseWhile(whileStep) {
    assertStep(whileStep, "WHILE", "parseWhile");

    let [condition] = whileStep.args;
    const whileName = whileStep.name;
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