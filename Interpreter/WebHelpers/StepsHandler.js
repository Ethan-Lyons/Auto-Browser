import fs from 'fs';
import * as WebHelpers from './WebHelpers.js';

export async function handleRoutine(context, routine) {
  let rStack;
  rStack = routine.steps.reverse();
  while (rStack != []){
    currentStep = rStack.pop;
    handleStep(context, currentStep, rStack);
    // the only special case to support is the conditionals (for, if, etc.)
    // those will only be accessible as top level user actions (wouldnt make sense to be in other places i think)
    // and are the only way which
    // alters steps below itself in the stack
  }

}

async function handleStep(context, step, rStack) {
  let selectedStep;
  console.log("Step: " + step.name + " " + step.type);

  if (step.type == "ActionGroup") {
    selectedStep = step.selected;
    await handleStep(context, selectedStep);
  }
  else if (step.type == "Action") {
    await handleAction(context, step, rStack);
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
export async function handleAction(context, currentStep, routineStack) {
    try {
        if(currentStep.name == "CLICK") {
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
          throw new Error('\"' + currentStep.name + '\" is not defined in WebHelpers.');
        }
      } catch (err) {
        throw new Error('\nError during execution of action: ' + currentStep.name + '\n' + err);
      }
    }

/**
 * Loads a routine object from a JSON file.
 * @param {string} filePath The path of the file to load the routine from.
 * @throws {Error} Error during execution of action.
 * @returns {Routine} The loaded routine object.
 */
export function loadRoutineFromJSON(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const routine = JSON.parse(fileContent);
    return routine;
  } catch (error) {
    throw new Error(`Failed to load routine from file '${filePath}' in loadRoutineFromJSON: ${error}`);
  }
}