export async function routineFor(context, forStep, runtime) {
  let [startIndex, endIndex] = forStep.args;

  startIndex = Number(startIndex.value ?? startIndex);
  endIndex = Number(endIndex.value ?? endIndex);

  const loopCount = Math.max(endIndex - startIndex, 0);

  const body = runtime.popUntil(
    step => step.name?.toUpperCase() === "ENDFOR"
  );

  for (let i = 0; i < loopCount; i++) {
    runtime.pushMany(body);
  }
}
