/**
 * Attempts to convert objects to readable strings, if stringify fails,
 * the default string is returned.
 * @param {Object} obj The object to stringify.
 * @returns A string describing the input object.
 */
function safeStringify(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

/**
 * Throws an error if input step does not have the expected name.
 * @param {Object} step The step object.
 * @param {string} expectedName The expected step name.
 * @param {string} caller The name of the calling function.
 */
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
