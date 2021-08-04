const inquirer = require('inquirer');

module.exports = {
  askLocationDetails: () => {
    const questions = [
      {
        type: 'confirm',
        name: 'generate',
        message: 'Generate project in current directory?',

      },
    ];
    return inquirer.prompt(questions);
  },
  packageManager: () => {
    const questions = [
      {
        type: 'list',
        name: 'manager',
        message: 'Use yarn or npm?',
        default: 'yarn',
        choices: [ 'yarn', 'npm' ],
      },
    ];
    return inquirer.prompt(questions);
  },
  generateRandomKeys: () => {
    const questions = [
      {
        type: 'confirm',
        name: 'keys',
        message: 'Generate masterKey and appId?',
      },
    ];
    return inquirer.prompt(questions);
  },
  installDB: () => {
    const questions = [
      {
        type: 'list',
        name: 'db',
        message: 'Install mongodb or postgres?',
        default: 'mongo',
        choices: [ 'mongo', 'postgres', 'skip'],
      },
    ];
    return inquirer.prompt(questions);
  },
  showJSOptions: () => {
    const questions = [
      {
        type: 'list',
        name: 'library',
        message: 'Get started with a sample page?',
        default: 'mongo',
        choices: [ 'React', 'Vue', 'JavaScript + jQuery'],
      },
    ];
    return inquirer.prompt(questions);
  }
};