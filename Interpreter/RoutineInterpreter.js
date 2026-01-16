import * as WebHelpers from './WebHelpers/WebHelpers.js';
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
 * Execute routine in browser context
 */
export async function runBrowser(routine) {
  const context = await WebHelpers.connectToContext();
  try {
    await WebHelpers.handleRoutine(context, routine);
  } finally {
    await WebHelpers.browserDisconnectContext(context);
  }
}

export async function main(argv = process.argv) {
  const routinePath = getPath(argv);
  const routine = await getRoutine(routinePath);
  await runBrowser(routine);
}