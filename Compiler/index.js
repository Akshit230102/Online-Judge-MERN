const express = require('express');
const app = express();
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const { executePy } = require('./exexutePy');
const { executeJava } = require('./executeJava');
const cors = require('cors');
const axios = require('axios');

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ online: 'compiler' });
});

app.post("/run", async (req, res) => {
    const { language = 'cpp', code, input } = req.body;
    if (code === undefined) {
      return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
      const filePath = await generateFile(language, code);
      const inputPath = await generateInputFile(input);
      let output;
      if (language === 'cpp') {
        output = await executeCpp(filePath, inputPath);
      } else if (language === 'python') {
        output = await executePy(filePath, inputPath);
      } else {
        output = await executeJava(filePath, inputPath);
      }
      res.json({ filePath, inputPath, output });
    } catch (error) {
      console.error('Backend error:', error);
      if (error.type === 'tle') {
        return res.status(200).json({ error: 'Time Limit Exceeded' });
      }
      res.status(500).json({ error: error.type === 'compilation' ? 'Compilation Error' : 'Runtime Error', stderr: error.stderr });
    }
  });


  app.post('/submit', async (req, res) => {
    const { language, code, id } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }
  
    try {
      const testcasesResponse = await axios.get(`http://192.168.29.173:5001/testcases/${id}`);
      const testcases = testcasesResponse.data;
  
      if (!testcases) {
        return res.status(404).json({ error: 'No test cases found for this problem' });
      }
  
      const filePath = await generateFile(language, code);
  
      for (let i = 0; i < testcases.inputs.length; i++) {
        const input = testcases.inputs[i];
        const expectedOutput = testcases.outputs[i];
        const inputPath = await generateInputFile(input);
  
        let output;
        try {
          if (language === 'cpp') {
            output = await executeCpp(filePath, inputPath);
          } else if (language === 'python') {
            output = await executePy(filePath, inputPath);
          } else if (language === 'java') {
            output = await executeJava(filePath, inputPath);
          }
        } catch (error) {
          if (error.type === 'tle') {
            return res.status(200).json({ verdict: 'Time Limit Exceeded', testcase: i + 1 });
          }
          return res.status(400).json({
            error: error.type === 'compilation' ? 'Compilation Error' : 'Runtime Error',
            stderr: error.stderr,
            testcase: i + 1
          });
        }
  
        if (output.trim() !== expectedOutput.trim()) {
          return res.status(200).json({ verdict: 'Wrong Answer', testcase: i + 1 });
        }
      }
  
      res.status(200).json({ verdict: 'Accepted', testcases: testcases.inputs.length });
    } catch (error) {
      console.log('message:', error)
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  



app.listen(8000, () => {
    console.log("Server is listening on port 8000!");
});