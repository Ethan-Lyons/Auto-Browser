import { condition } from "./Condition.js";
import { assertStep } from "./Assert.js";

export async function routineIf(context, ifStep, routine) {
  ifSpec = parseIf(ifStep);
  conResult = await condition(context, ifSpec.condition)
  exeIf(routine, conResult, ifSpec.name);
}

export function parseIf(ifStep) {
    assertStep(ifStep, "IF", "parseIf");

    let [conditionStep] = ifStep.args;

    const ifName = ifStep.name;
    return { name: ifName, condition: conditionStep }
}

export function exeIf(routine, condition, ifName) {
  // Block contains:
  //  body: actions to execute if condition is true
  //  bodyPost: actions to execute if condition is false
  //  end: end marker
  const block = routine.popControlBlock(ifName);

  if (condition) { // Push items inside the if section
    routine.pushManyStack(block.body); 
  }
  else if (block.bodyPost) {  // Push items inside the else section
    routine.pushManyStack(block.bodyPost);
  }
}