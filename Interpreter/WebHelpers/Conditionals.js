import { resolveString, resolveNumber, resolveBoolean } from "./StoreVariables";

export function routineFor(forStep, routine) {
  let [start, end] = forStep.args;
  const forName = forStep.name

  start = resolveNumber(start.value)
  end = resolveNumber(end.value)

  const loopCount = Math.max(end - start, 0);

  const body = routine.popControlBlock(forName)

  for (let i = 0; i < loopCount; i++) {
    routine.pushMany(body);
  }
}

export function routineIf(ifStep, routine) {
  let [condition] = ifStep.args;
  const ifName = ifStep.name

  condition = resolveBoolean(condition)

  const body = routine.popControlBlock(ifName)

  if (condition){
    routine.pushMany(body);
  }
}
