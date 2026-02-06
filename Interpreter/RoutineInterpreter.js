import * as WebHelpers from './WebHelpers/WebHelpers.js';
import { getBrowser, browserDisconnect } from './WebHelpers/Browser.js';
import { Routine } from './WebHelpers/Routine.js';

/**
 * Obtains the path to the routine from the command line.
 * @param {*} argv The command line arguments.
 * @returns {String} The path to the routine.
 */
export function getPath(argv) {
  const termArgs = argv.slice(2);
  if (termArgs.length === 0) {
    throw new Error('No routine argument provided.');
  }
  return termArgs[0];
}

/**
 * Loads a routine from a file and returns it.
 * @param {String} routinePath 
 * @returns {Routine} The routine object loaded from the file.
 */
export async function getRoutine(routinePath) {
  return Routine.fromFile(routinePath);
}

/**
 * Runs a routine object on a browser context.
 * @param {Browser} browser The browser instance to use.
 * @param {Routine} routine The routine object to run.
 * @param {Boolean} newContext If true, creates a new browser context instance for the routine.
 * @param {Boolean} autoClose If true, automatically closes the browser context instance upon completion.
 */
export async function runRoutine(browser, routine, newContext = false, autoClose = true) {
  let context;

  try {
    context = await WebHelpers.getContext(browser, newContext);
    await WebHelpers.handleRoutine(context, routine);
    
    console.log("Routine \"" + routine.getName() + "\" Finished.\n")

  } catch (err) { // Hard failure: Clean up browser
    throw err;
    
  } finally { // Clean up context
    if (autoClose && context && newContext) {
      await WebHelpers.closeContext(context);
    }
  }
}

/**
 * Entry point for the routine interpreter.
 * Obtains file path, routine object, and browser context before running the routine.
 * @param {*} argv The command line arguments.
 */
export async function main(argv = process.argv) {
  const routinePath = getPath(argv);
  const routine = await getRoutine(routinePath);
  const browser = await getBrowser();

  try {
    await runRoutine(browser, routine, false, true);
  } finally { // Clean up
    await WebHelpers.browserDisconnect(browser)
  }
}
