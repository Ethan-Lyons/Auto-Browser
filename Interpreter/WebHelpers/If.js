import { condition } from "./Condition.js";

export async function routineIf(context, ifStep, routine) {
  ifSpec = parseIf(ifStep);
  conResult = condition(context, ifSpec.condition)
  await exeIf(routine, conResult, ifSpec.name);
  
}

export async function parseIf(ifStep) {
    if (!ifStep || ifStep.name?.toUpperCase() !== "IF") {
        throw new Error(`parseIf: input is not an IF action.
        Input: ${ifStep}, Name: ${ifStep.name}`);
    }

    let [condition] = ifStep.args;
    const ifName = ifStep.name;
    return { name: ifName, condition: condition}
}

async function exeIf(routine, condition, ifName) {
  // Block contains:
  //  body: actions to execute if condition is true
  //  bodyPost: actions to execute if condition is false
  //  end: end marker
  const block = routine.popControlBlock(ifName);

  if (condition){ // Push items inside the if section
    routine.pushManyStack(block.body); 
  }
  else {  // Push items inside the else section
    routine.pushManyStack(block.bodyPost);
  }
}