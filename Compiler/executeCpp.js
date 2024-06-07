const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out < ${inputPath}`,
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
  executeCpp,
};