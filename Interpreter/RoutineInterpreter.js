import fs from 'fs';
import * as WebHelpers from './WebHelpers/WebHelpers.js';  
import puppeteer from 'puppeteer-core';
import assert from 'assert';

import { fileURLToPath } from 'url';
import path from 'path';
import { get } from 'http';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const URL_NAV = "URL_NAV";  // Args: url
const TAB_NAV = "TAB_NAV";  // Args: tab
const FIND = "FIND";    // Args: selector, saveAs
const FIND_GROUP = "FIND_GROUP";    // Args: selector, saveAs
const CLICK = "CLICK";  // Args: selector
const NEW_TAB = "NEW_TAB";

async function main() {
  routine = await getRoutine();
  await runBrowser(routine);
}

async function getRoutine() {
  const routinePath = await getPath();
  const routine = await WebHelpers.loadRoutineFromFile(routinePath);
  return routine;
}

async function getPath() {
  const termArgs = process.argv.slice(2); // isolate the command line args
  if (termArgs.length === 0) {
    throw new Error('No routine argument provided.');
  }

  return termArgs[0];
}

async function runBrowser(routine) {
  browser = await WebHelpers.connectToBrowser();
  try {
    for (let step of routine.steps) {
      await WebHelpers.handleStep(browser, step);
    }
  } catch (err) {
    throw new Error('Error during routine execution in runBrowser:\n' + err);
  } finally {
    await WebHelpers.disconnect(browser);
  }
}

main();