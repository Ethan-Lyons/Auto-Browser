import { main } from './RoutineInterpreter.js';

// Manual execution example:  node ./Interpreter/CLI.js ./TestData/test_for_loop.json

main(process.argv).catch(err => {
  console.error(err.stack || err.message);
  process.exit(1);
});