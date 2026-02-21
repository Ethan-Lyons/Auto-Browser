import { BrowserContext } from 'puppeteer-core';
import { routineIf, routineFor, routineWhile, store, click, urlNav,
  tabNav, newTab, closeTab, wait, Routine, runRoutine, keyboard, history, output } from './WebHelpers.js';

/**
 * Runs all steps in a given routine.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {Routine} routine 
 * @returns {Promise<void>} A promise that resolves when the routine has executed.
 */
export async function handleRoutine(context, routine) {
  if (!(routine instanceof Routine)) {
    throw new Error("Routine is not an instance of Routine. Type: " + typeof routine);
  }

  // Get next step from top of stack
  while (routine.hasNext()) {
    const step = routine.pop();
    await handleStep(context, step, routine);
  }
}

/**
 * Runs a single step in a routine.
 * @param {BrowserContext} context The browser context instance to use.
 * @param {Object} step The step object.
 * @param {Routine} routine The routine object.
 * @throws {Error} Error during execution of step.
 * @returns {Promise<void>} A promise that resolves when the step has executed.
 */
export async function handleStep(context, step, routine) {
  const upType = step.type.toUpperCase();

  switch (upType) {
    case "ACTIONGROUP": // extract selected step from groups
      const selectedStep = step.selected;
      await handleStep(context, selectedStep, routine);
      break;

    case "ACTION":  // execute actions
      await handleAction(context, step, routine);
      break;

    case "ARGUMENT":  // ignore lone arguments
      break;

    default:
      throw new Error("Unknown step type: " + step.type);
  }
}

/**
 * Handles a single step in a routine. Supports the following user actions:
 *   - CLICK: Clicks on an element matching the given selector.
 *   - URL_NAV: Navigates to the given url.
 *   - TAB_NAV: Navigates to the given tab.
 *   - NEW_TAB: Opens a new tab.
 *   - WAIT: Waits for the given amount of time.
 *   - STORE: Stores the result of an action under a new variable name.
 *   - FOR: Executes a for loop.
 *   - IF: Executes an if statement.
 *   - WHILE: Executes a while loop.
 *   - CLOSE_TAB: Closes the current tab.
 *   - HISTORY: Navigates to the previous page.
 *   - OUTPUT: Executes an output action.
 * 
 * @param {BrowserContext} context The browser context instance to use.
 * @param {Object} currentStep An object containing the information for the current step.
 * @returns {Promise<void>} A promise that resolves when the step has executed.
 * @throws {Error} If the step type is unknown.
 */
export async function handleAction(context, currentStep, routine) {
  const stepName = currentStep.name.toUpperCase();
  
  switch (stepName) {
    case "FOR":
      routineFor(currentStep, routine);
      break;

    case "IF":
      await routineIf(context, currentStep, routine);
      break;

    case "WHILE":
      await routineWhile(context, currentStep, routine);
      break;

    case "STORE":
      await store(context, currentStep);
      break;

    case "CLICK":
      await click(context, currentStep);
      break;
    
    case "URL_NAV":
      await urlNav(context, currentStep);
      break;
    
    case "TAB_NAV":
      await tabNav(context, currentStep);
      break;
    
    case "NEW_TAB":
      await newTab(context);
      break;
    
    case "CLOSE_TAB":
      await closeTab(context);
      break;
    
    case "WAIT":
      await wait(currentStep);
      break;
    
    case "HISTORY":
      await history(context, currentStep);
      break;
    
    case "OUTPUT":
      await output(context, currentStep);
      break;
    
    case "RUN_ROUTINE":
      await runRoutine(context, currentStep);
      break;
    
    case "KEYBOARD":
      await keyboard(context, currentStep);
      break;

    default:
      throw new Error('\"' + currentStep.name +
        '\" is not defined under StepsHandler.');
  }
}