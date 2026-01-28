function safeStringify(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

export function assertStep(step, expectedName, caller) {
    const actualName = step?.name;

    if (!step || actualName?.toUpperCase() !== expectedName.toUpperCase()) {
        throw new Error(
            `${caller}: input is not a ${expectedName} action.
            Expected: ${expectedName}
            Actual: ${actualName}

            Step summary:
                ${safeStringify({
                    name: step?.name,
                    type: step?.type,
                    argsLength: step?.args?.length,
                    keys: step && Object.keys(step)
                })}

            Full step:
                ${safeStringify(step)}`
        );
    }
}
