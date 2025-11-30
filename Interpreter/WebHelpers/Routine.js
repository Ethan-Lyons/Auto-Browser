export async function handleStep(browser, step) {
  let selectedStep;
  console.log("Step: " + step.name + " " + step.type);

  if (step.type == "ActionGroup") {
    selectedStep = step.selected;
    await handleStep(browser, selectedStep);
  }
  else if (step.type == "Action") {
    await handleAction(browser, step);
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
 * @param {puppeteer.Browser} browser The browser instance to use.
 * @param {Object} currentAction A dictionary entry for a step. This step should have a single action and its corresponding arguments.
 * @throws {Error} Error during execution of action.
 */
export async function handleAction(browser, currentAction) {
    try {
        assert(currentAction.type == "Action", "Current step is not an action");
        if(currentAction.name == CLICK) {
          const selectedGroupStep = currentAction.args[0];
          const selectedType = selectedGroupStep.selected;
          await WebHelpers.click(browser, selectedType);
        }
        else if (currentAction.name == FIND) {
          const selectedGroupStep = currentAction.args[0];
          const selectedType = selectedGroupStep.selected;
          await WebHelpers.find(browser, selectedType); //currentStep);
        }
        else if (currentAction.name == FIND_GROUP) {
          await WebHelpers.findGroup(browser, currentAction);
        }
        else if (currentAction.name == URL_NAV) {
          await WebHelpers.urlNav(browser, currentAction);
        }
        else if (currentAction.name == TAB_NAV) {
          await WebHelpers.navToTab(browser, currentAction);
        }
        else if (currentAction.name == NEW_TAB) {
          await WebHelpers.newTab(browser);
        }
      } catch (err) {
        throw new Error('\nError during execution of action: ' + currentAction.name + '\n' + err);
      }
    }

export async function loadRoutineFromFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const routine = JSON.parse(fileContent);
    return routine;
  } catch (error) {
    throw new Error(`Failed to load routine from file '${filePath}' in loadRoutineFromFile: ${error}`);
  }
}