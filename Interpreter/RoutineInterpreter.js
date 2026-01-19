import * as WebHelpers from './WebHelpers/WebHelpers.js';
import { getBrowser, browserDisconnect } from './WebHelpers/Browser.js';
import { Routine } from './WebHelpers/Routine.js';

/**
 * Extract routine path from argv
 */
export function getPath(argv) {
  const termArgs = argv.slice(2);
  if (termArgs.length === 0) {
    throw new Error('No routine argument provided.');
  }
  return termArgs[0];
}

/**
 * Load routine from file
 */
export async function getRoutine(routinePath) {
  return Routine.fromFile(routinePath);
}

/**
 * Execute a routine in a browser context
 * If an error occurs, the browser is force-closed to avoid leaks.
 */
export async function runRoutine(browser, routine, newContext = false, autoClose = true) {
  let context;

  try {
    context = await WebHelpers.getContext(browser, newContext);
    await WebHelpers.handleRoutine(context, routine);
    console.log("Routine \"" + routine.getName() + "\" Finished.\n")

  } catch (err) { // Hard failure: Clean up browser
    //await browserDisconnect(browser)
    throw err;
    
  } finally { // Clean up context
    if (autoClose && context && newContext) {
      await WebHelpers.closeContext(context);
    }
  }
}

/**
 * Entry point
 */
export async function main(argv = process.argv) {
  const routinePath = getPath(argv);
  const routine = await getRoutine(routinePath);

  const browser = await getBrowser();

  try {
    await runRoutine(browser, routine, false, true);
  } finally {
    await WebHelpers.browserDisconnect(browser)
  }
}
