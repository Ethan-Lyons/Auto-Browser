//const fs = require('fs');
import fs from 'fs';
//const WebHelpers = require('./WebHelpers');
import * as WebHelpers from './WebHelpers/WebHelpers.js';  
//const puppeteer = require('puppeteer-core'); // npm install puppeteer-core
import puppeteer from 'puppeteer-core';
//const { assert } = require('console');
import assert from 'assert';

import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URL_NAV = "URL_NAV";  // Args: url
const TAB_NAV = "TAB_NAV";  // Args: tab
const FIND = "FIND";    // Args: selector, saveAs
const FIND_GROUP = "FIND_GROUP";    // Args: selector, saveAs
const CLICK = "CLICK";  // Args: selector
const NEW_TAB = "NEW_TAB";


async function main() {
  let browser;
  try {
    const routine = await getRoutine();

    browser = await WebHelpers.connectToBrowser();
    for (let step of routine.steps) {
      await handleStep(browser, step);
    }
  } catch (err) {
    console.error('Error during routine execution:\n', err);
    process.exit(1);
  } finally {
    await WebHelpers.disconnect(browser);
  }
}

async function getRoutine() {
  const routinePath = path.join(__dirname, "../", "Creator", "Routines", "newTabTest.json");   // FOR TESTING
  console.log("Starting Routine from \"" + routinePath + "\"...");

  const routine = JSON.parse(fs.readFileSync(routinePath, 'utf8'));
  return routine;
}

async function handleStep(browser, step) {
  let selectedStep;
  console.log("Step: " + step.name + " " + step.type);

  if (step.type == "ActionGroup") {
    selectedStep = step.selected;
    await handleStep(browser, selectedStep);
  }
  else if (step.type == "Action") {
    await executeAction(browser, step);
  }
  else if (step.type == "Argument") {
    //ignore
  }
}

/**
 * Execute an action from a step.
 * @param {puppeteer.Browser} browser The browser to execute the action on.
 * @param {Object} currentStep The step to execute.
 */
async function executeAction(browser, currentStep) {
  try {
    console.log("Running action: " + currentStep.name + " " + currentStep.type);
    assert(currentStep.type == "Action", "Current step is not an action");
    
    WebHelpers.handleStep(browser, currentStep);
  } catch (err) {
    console.error('Error during execution of action: ' + currentStep.name + '\n', err);
    process.exit(1);
  }
}

main();