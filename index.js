#!/usr/bin/env node

const clear = require("clear");
const { askLocationDetails, packageManager, generateRandomKeys, installDB, showJSOptions, getInstallOptions } = require("./lib/inquirer.js");
const { run } = require("./lib/command.js");
const { spinner, stop } = require("./lib/spinner.js");
const { makeID } = require("./lib/utils.js");

clear();
const welcome = `
                  1111111111
               1111111111111111
            1111111111111111111111
          11111111111111111111111111
        111111111111111       11111111
       1111111111111             111111
      1111111111111   111111111   111111
      111111111111   11111111111   111111
     1111111111111   11111111111   111111
     1111111111111   1111111111    111111
     1111111111111111111111111    1111111
     11111111                    11111111
      111111         1111111111111111111
      11111   11111  111111111111111111
       11111         11111111111111111
        111111     111111111111111111
          11111111111111111111111111
            1111111111111111111111
              111111111111111111
                  11111111111

        Welcome to the Parse CLI 🙏
  Please consider donating to our open collective
      to help us maintain this package.
  👉 https://opencollective.com/parse-server
  `;
console.log(welcome);
(async () => {
  try {
    const version = process.version.match(/^v(\d+\.\d+)/)[1];
    if (version < 4.3) {
      console.log('Sorry, Parse Server requires at least Node 4.3.');
      return;
    }
    const { generate } = await askLocationDetails();
    if (!generate) {
      return;
    }
    const { manager } = await packageManager();
    spinner('Cloning example repo...');
    await run('git clone --single-branch --branch dotenv https://github.com/dblythy/parse-server-example.git .')
    spinner("Installing Dependencies...");
    await run(`rm -rf .git && ${manager} install`);
    stop();
    const {options} = await getInstallOptions();
    const removeFile = (file) => run(`rm -rf ${file}`);
    if (!options.includes('Elastic Beanstalk')) {
      await Promise.all([
        removeFile('.ebextensions'),
        removeFile('.nycrc'),
        removeFile('app.yaml')
      ])
    }
    if (!options.includes('Heroku')) {
      await removeFile('app.json');
    }
    if (!options.includes('Docker')) {
      await removeFile('Dockerfile');
    }
    if (!options.includes('OpenShift')) {
      await removeFile('openshift.json');
    }
    if (!options.includes('Scalingo')) {
      await removeFile('scalingo.json');
    }
    const { keys } = await generateRandomKeys();
    let appId;
    if (keys) {
      appId = makeID();
      const fileDetails = `APP_ID=${appId}\nMASTER_KEY=${makeID()}\n`
      await run(`touch .env && echo "${fileDetails}" > .env`);
      console.log(`Your appId is:\n\n${appId}\n\nUse this to connect with the Parse SDKs.\nWe have also generated a masterKey. Do not use this on the frontend and rotate regularly.`)
    }
    const { db } = await installDB();
    if (db === 'mongo') {
      spinner("Installing Mongo...");
      await run(`brew tap mongodb/brew`);
      await run(`brew install mongodb-community@5.0`)
      stop();
    }
    if (db === 'postgres') {
      console.log(`Automatic postgres installation not yet supported.`);
    }

    const { library } = await showJSOptions();
    if (library === 'JavaScript + jQuery') {
      const location = require.resolve('./lib/utils.js').replace('/utils.js','')
      await run(`cat ${location}/samples/JavaScript/script.js > public/assets/js/script.js`);
      await run(`cat ${location}/samples/JavaScript/test.html > public/test.html`);
      if (appId) {
        await run(`sed -i '' 's/myAppId/${appId}/g' public/test.html`);
        await run(`sed -i '' 's/myAppId/${appId}/g' public/assets/js/script.js`);
      }
    } else if (library === 'React') {

    } else {

    }
    console.log('Your Parse Server is ready to go! Run npm start and visit http://localhost:1337/test to begin.');

  } catch (e) {
    console.log({ e });
    console.log(`Error: ${e.message}`);
  }
  stop();
})();
