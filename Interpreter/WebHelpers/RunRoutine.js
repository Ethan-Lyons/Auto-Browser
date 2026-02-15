

/**
 * Parses and executes a runRoutine action.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {  } rrStep An object
 * containing the information for the runRoutine action.
 * @returns {Promise<void>} A promise that resolves when the runRoutine action is completed.
 */
export async function runRoutine(context, rrStep) {
    //const page = await getActivePage(context);
    const rrSpec = parseRunRoutine(rrStep)

    await exeRunRoutine()
}

/**
 * Obtains the important values from a 'keyboardStep' input and returns them using an object.
 * @param {  } keyStep An object
 * containing the information for the runRoutine action.
 * @returns {  }
 */
export async function parseRunRoutine(rrStep) {

}

/**
 * Calls the correct output function based on the output mode.
 * @param {BrowserContext} context The browser context instance to use.

 * @returns {Promise<void>} A promise that resolves when the runRoutine action is completed.
 */
export async function exeRunRoutine() {
    
}