export async function routineFor(context, forStep, routine) {
  let [start, end] = forStep.args;
  const forName = forStep.name

  //start = Number(start.value ?? start);
  //end = Number(end.value ?? end);
  start = Number(start.value)
  end = Number(end.value)

  const loopCount = Math.max(end - start, 0);

  const body = routine.popControlBlock(forName)

  for (let i = 0; i < loopCount; i++) {
    routine.pushMany(body);
  }
}
