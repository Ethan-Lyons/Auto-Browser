import { condition } from "./Condition.js";
import { assertStep } from "../Assert.js";
import { assert } from "puppeteer-core";

export async function routineWhile(context, whileStep, routine) {
    whileSpec = parseWhile(whileStep);
    conResult = await condition(context, whileSpec.condition)
    exeWhile(routine, conResult, whileStep)
}

export function parseWhile(whileStep) {
    assertStep(whileStep, "WHILE", "parseWhile");

    let [condition] = whileStep.args;
    const whileName = whileStep.name;
    return { name: whileName, condition: condition }
}

export async function exeWhile(routine, conResult, whileStep) {
    assert(conResult == true || conResult == false,
        "exeWhile: input condition is not boolean");
    // Block contains:
    //  body: actions to execute
    //  bodyPost: empty
    //  end: end marker
    const block = routine.popControlBlock(whileStep.name);
    if (conResult == true && block.body.length > 0) {
        // Push actions to execute
        routine.pushManyStack(block.body);  

        // Duplicate original while structure to loop again
        routine.push(block.end);
        routine.pushManyStack(block.body);
        routine.push(whileStep)
    }
}