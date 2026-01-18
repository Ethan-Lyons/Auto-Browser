import { routineFor } from "../WebHelpers/Conditionals.js";
import { runBrowser, getRoutine } from "../RoutineInterpreter.js";

test('FOR loop basic', async () => {
  const routine = await getRoutine('./TestData/test_for_loop.json');
  await runBrowser(routine);
});

test('If false', async () => {
  const routine = await getRoutine('./TestData/test_if_false.json');
  await runBrowser(routine);
});

test('If true', async () => {
  const routine = await getRoutine('./TestData/test_if_true.json');
  await runBrowser(routine);
});

// TODO: Maybe update runBrowser so it can reuse the same browser with new context for each test