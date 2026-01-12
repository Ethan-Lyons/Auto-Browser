import fs from 'fs';
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
  else if (step.type == "Argument") {
    //ignore
  }
}

/**
 * Handles a single step in a routine. Supports the following actions:
 *   - CLICK: Clicks on an element matching the given selector.
 *   - FIND: Finds an element matching the given selector.
 *   - FIND_GROUP: Finds an element matching the given selector group.
 *   - URL_NAV: Navigates to the given url.
 *   - TAB_NAV: Navigates to the given tab.
 *   - NEW_TAB: Opens a new tab.
 * @param {puppeteer.BrowserContext} context The browser context instance to use.
 * @param {Object} currentStep A dictionary entry for a step. This step should have a single action and its corresponding arguments.
 * @throws {Error} Error during execution of action.
 */
export async function handleAction(context, currentStep, routine) {
    currentStep.name = currentStep.name.toUpperCase()
    try {
        if (currentStep.name == "FOR") {
          await WebHelpers.routineFor(context, currentStep, routine)
        }
        else if(currentStep.name == "CLICK") {
          await WebHelpers.click(context, currentStep);
        }
        else if (currentStep.name == "FIND") {
          await WebHelpers.find(context, currentStep);
        }
        else if (currentStep.name == "FIND_GROUP") {
          await WebHelpers.findGroup(context, currentStep);
        }
        else if (currentStep.name == "URL_NAV") {
          await WebHelpers.urlNav(context, currentStep);
        }
        else if (currentStep.name == "TAB_NAV") {
          await WebHelpers.navToTab(context, currentStep);
        }
        else if (currentStep.name == "NEW_TAB") {
          await WebHelpers.newTab(context);
        }
        else if (currentStep.name == "STORE") {
          await WebHelpers.store(context, currentStep);
        }
        else {
          throw new Error('\"' + currentStep.name + '\" is not defined under StepsHandler.');
        }
      } catch (err) {
        throw new Error('\nError during execution of action: ' + currentStep.name + '\n' + err);
      }
    }