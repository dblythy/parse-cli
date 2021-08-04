const CLI = require('clui');
const Spinner = CLI.Spinner;

let spinner;
const stop = () => {
  if (spinner) {
    spinner.stop();
  }
}
module.exports = {
  spinner(message) {
    stop();
    spinner = new Spinner(message);
    spinner.start();
  },
  stop
}