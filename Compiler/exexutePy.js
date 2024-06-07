const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const executePy = (filepath,inputPath) => {
  return new Promise((resolve, reject) => {
    exec(
      `python ${filepath} < ${inputPath}`,
      (error, stdout, stderr) => {
        if (error) {
            // Likely compilation error
            const compilationError = {
              type: 'compilation',
              stderr: stderr
            };
            reject(compilationError);
          } else if (stderr.includes('segmentation fault')) {
            // Example: Detect runtime error (replace with your logic)
            const runtimeError = {
              type: 'runtime',
              stderr: stderr
            };
            reject(runtimeError);
          } else {
            resolve(stdout);
          }
      }
    );
  });
};

module.exports = {
  executePy,
};