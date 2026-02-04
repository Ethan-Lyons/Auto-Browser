import * as WebHelpers from './WebHelpers.js';

export async function handleRoutine(context, routine) {
  while (routine.hasNext()) {
    const step = routine.pop();
    await handleStep(context, step, routine);
  }
}

export async function handleStep(context, step, routine) {
  const type = step.type.toUpperCase();
  switch (type) {
    case "ACTIONGROUP":       //TODO: change naming style
      const selectedStep = step.selected;
      await handleStep(context, selectedStep, routine);
      break;

    case "ACTION":
      await handleAction(context, step, routine);
      break;

    case "ARGUMENT":
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
 * 
 * 
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {Object} currentStep A dictionary entry for a step.
 *  This step should have a single action and its corresponding arguments.
 * @throws {Error} Error during execution of action.
 */
export async function handleAction(context, currentStep, routine) {
  //currentStep.name = currentStep.name.toUpperCase()
  const stepName = currentStep.name.toUpperCase();
  
  switch (stepName) {
    case "FOR":
      WebHelpers.routineFor(currentStep, routine);
      break;

    case "IF":
      await WebHelpers.routineIf(context, currentStep, routine)
      break;

    case "WHILE":
      await WebHelpers.routineWhile(context, currentStep, routine)
      break;

    case "STORE":
      await WebHelpers.store(context, currentStep);
      break;

    case "CLICK":
      await WebHelpers.click(context, currentStep);
      break;
    
    case "URL_NAV":
      await WebHelpers.urlNav(context, currentStep);
      break;
    
    case "TAB_NAV":
      await WebHelpers.tabNav(context, currentStep);
      break;
    
    case "NEW_TAB":
      await WebHelpers.newTab(context);
      break;
    
    case "WAIT":
      await WebHelpers.wait(currentStep)
      break;

    default:
      throw new Error('\"' + currentStep.name +
        '\" is not defined under StepsHandler.');
  
  }
}