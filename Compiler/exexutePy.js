const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const executePy = (filepath, inputPath) => {
  const timeLimit = 2000; // 2 seconds in milliseconds

  return new Promise((resolve, reject) => {
    const run = spawn('python', [filepath], { stdio: ['pipe', 'pipe', 'pipe'] });

    const timer = setTimeout(() => {
      run.kill();
      const tleError = {
        type: 'tle',
        stderr: 'Time Limit Exceeded'
      };
      reject(tleError);
    }, timeLimit);

    run.stdin.write(fs.readFileSync(inputPath));
    run.stdin.end();

    let output = '';
    run.stdout.on('data', (data) => {
      output += data.toString();
    });

    run.stderr.on('data', (data) => {
      run.kill();
      clearTimeout(timer);
      const runtimeError = {
        type: 'runtime',
        stderr: data.toString()
      };
      reject(runtimeError);
    });

    run.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve(output);
      } else {
        const runtimeError = {
          type: 'runtime',
          stderr: 'Runtime Error'
        };
        reject(runtimeError);
      }
    });
  });
};

module.exports = {
  executePy,
};
