import { main } from './InterpreterApp.js';

// Manual execution example:  node ./Interpreter/CLI.js ./TestData/test_for_loop.json

 /**
  * Main entry point when running from command line.
  */
main(process.argv).catch(err => {
  console.error(err.stack || err.message);
  process.exit(1);
});