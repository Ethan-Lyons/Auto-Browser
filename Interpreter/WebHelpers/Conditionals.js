import { resolveString, resolveNumber, resolveBoolean } from "./StoreVariables.js";

export function routineFor(forStep, routine) {
  let [start, end] = forStep.args;
  const forName = forStep.name

  start = resolveNumber(start.value)
  end = resolveNumber(end.value)

  const loopCount = Math.max(end - start, 0);

  const block = routine.popControlBlock(forName);
  const body = block.body;

  for (let i = 0; i < loopCount; i++) { // repeat for loop n times
    routine.pushManyStack(body);
  }
}

export function routineWhile(whileStep, routine) {
  let [condition] = whileStep.args;
  const whileName = whileStep.name;

  condition = resolveBoolean(condition);

  const block = routine.popControlBlock(whileName);
  const body = block.slice(0, -1);

  if (condition){
    routine.pushManyStack(body);  // push actions to execute

    routine.pushManyStack(block);
    routine.push(whileStep) //duplicate original while structure
  }
}

export function routineIf(ifStep, routine) {
  let [condition] = ifStep.args;
  const ifName = ifStep.name;

  condition = resolveBoolean(condition);

  const block = routine.popControlBlock(ifName);

  if (condition){
    routine.pushManyStack(block.body); // Push items inside the if section
  }
  else {
    routine.pushManyStack(block.bodyPost); // Push items inside the else section
  }
}
