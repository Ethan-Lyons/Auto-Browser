import * as WebHelpers from './WebHelpers.js';

export async function handleRoutine(context, routine) {
  while (routine.hasNext()) {
    const step = routine.pop();
    await handleStep(context, step, routine);
  }
}

async function handleStep(context, step, routine) {
  let selectedStep;
  if (step.name !== "USER_ACTIONS")
  console.log("Step: " + step.name + "  [" + step.type + "]");

  if (step.type == "ActionGroup") {
    selectedStep = step.selected;
    await handleStep(context, selectedStep, routine);
  }
  else if (step.type == "Action") {
    await handleAction(context, step,routine);
  }
  //else if (step.type == "Argument") {}  //ignore
}

/**
 * Handles a single step in a routine. Supports the following user actions:
 *   - CLICK: Clicks on an element matching the given selector.
 *   - URL_NAV: Navigates to the given url.
 *   - TAB_NAV: Navigates to the given tab.
 *   - NEW_TAB: Opens a new tab.
 * 
 * 
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {Object} currentStep A dictionary entry for a step.
 *  This step should have a single action and its corresponding arguments.
 * @throws {Error} Error during execution of action.
 */
export async function handleAction(context, currentStep, routine) {
  currentStep.name = currentStep.name.toUpperCase()

  if (currentStep.name == "FOR") {                    // FOR
    WebHelpers.routineFor(currentStep, routine)
  }
  else if (currentStep.name == "IF") {                // IF
    await WebHelpers.routineIf(currentStep, routine)
  }
  else if (currentStep.name == "WHILE") {             // WHILE
    WebHelpers.routineWhile(currentStep, routine)
  }
  else if(currentStep.name == "CLICK") {              // CLICK
    await WebHelpers.click(context, currentStep);
  }
  else if (currentStep.name == "URL_NAV") {           // URL_NAV
    await WebHelpers.urlNav(context, currentStep);
  }
  else if (currentStep.name == "TAB_NAV") {           // TAB_NAV
    await WebHelpers.tabNav(context, currentStep);
  }
  else if (currentStep.name == "NEW_TAB") {           // NEW_TAB
    await WebHelpers.newTab(context);
  }
  else if (currentStep.name == "STORE") {             // STORE
    await WebHelpers.store(context, currentStep);
  }
  else if (currentStep.name == "WAIT") {              // WAIT
    await WebHelpers.wait(currentStep)
  }
  else {
    throw new Error('\"' + currentStep.name +
      '\" is not defined under StepsHandler.');
  }
}