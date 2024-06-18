const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  const timeLimit = 2000; // 2 seconds in milliseconds

  return new Promise((resolve, reject) => {
    exec(`g++ ${filepath} -o ${outPath}`, (error, stdout, stderr) => {
      if (error) {
        const compilationError = {
          type: 'compilation',
          stderr: stderr
        };
        return reject(compilationError);
      }

      const run = spawn(`./${jobId}.out`, { cwd: outputPath, stdio: ['pipe', 'pipe', 'pipe'] });

      const timer = setTimeout(() => {
        run.kill();
        const tleError = {
          type: 'tle',
          stderr: 'Time Limit Exceeded'
        };
        reject(tleError);
      }, timeLimit);

      let inputFileData = '';
      if (fs.existsSync(inputPath)) {
        inputFileData = fs.readFileSync(inputPath, 'utf-8');
      }
      
      // Check if inputFileData is empty or invalid
      if (!inputFileData || typeof inputFileData !== 'string' || inputFileData.trim() === '') {
        clearTimeout(timer);
        run.kill();
        const emptyInputError = {
          type: 'empty-input',
          stderr: 'Input is empty or invalid'
        };
        reject(emptyInputError);
        return;
      }

      run.stdin.on('error', (err) => {
        clearTimeout(timer);
        const stdinError = {
          type: 'stdin-error',
          stderr: `Error writing to stdin: ${err.message}`
        };
        reject(stdinError);
      });

      // Check if process is still running before writing
      if (!run.killed) {
        run.stdin.write(inputFileData);
        run.stdin.end();
      }

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
  });
};

module.exports = {
  executeCpp,
};
