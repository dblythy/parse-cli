const { exec } = require("child_process");
module.exports = {
  run(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
            reject(error);
            console.log('error=>',error);
            return;
        }
        if (stderr) {
          console.log(`${stderr}`);
          resolve();
          return;
        }
        console.log(`${stdout}`);
        resolve();
      });
    })
  }
}