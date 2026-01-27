import { getRoutine, runRoutine } from "../RoutineInterpreter.js";
import { browserDisconnect } from "../WebHelpers/Browser.js";
import { getBrowser } from "../WebHelpers/Browser.js";

let browser;
let context;

beforeAll(async () => {
    
});

beforeEach(async () => {
    //context = await WebHelpers.createNewContext(browser);
    //clearVariables();
    try {
        browser = await getBrowser()
    } catch (err) {
        console.error('Error connecting to Puppeteer:\n', err);
        process.exit(1);
    }
});

/*afterEach(async () => {
    await context.close();
});*/

afterAll(async () => {
    await browserDisconnect(browser);
});

test('FOR loop basic', async () => {
  const routine = await getRoutine('./TestData/test_for_loop.json');
  await runRoutine(browser, routine, true, true)
});

test('FOR loop with store', async () => {
  const routine = await getRoutine('./TestData/test_for_loop_store.json');
  await runRoutine(browser, routine, true, true)
});

test('If false', async () => {
  const routine = await getRoutine('./TestData/test_if_false.json');
  await runRoutine(browser, routine, true, true);
});

test('If false store', async () => {
  const routine = await getRoutine('./TestData/test_if_false_store.json');
  await runRoutine(browser, routine, true, true);
});

test('If true', async () => {
  const routine = await getRoutine('./TestData/test_if_true.json');
  await runRoutine(browser, routine, true, true);
});

test('If true store', async () => {
  const routine = await getRoutine('./TestData/test_if_true_store.json');
  await runRoutine(browser, routine, true, true);
});

test('While false', async () => {
  const routine = await getRoutine('./TestData/test_while_false.json');
  await runRoutine(browser, routine, true, true);
});