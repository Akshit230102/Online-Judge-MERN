const express = require('express');
const app = express();
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const { executePy } = require('./exexutePy');
const { executeJava } = require('./executeJava');
const cors = require('cors');

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ online: 'compiler' });
});

app.post("/run", async (req, res) => {
    // const language = req.body.language;
    // const code = req.body.code;

    var { language = 'cpp', code, input } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        var output;
        const filePath = await generateFile(language, code);
        const inputPath = await generateInputFile(input);
        if(language=='cpp'){
            output = await executeCpp(filePath, inputPath);
        }
        else if(language=='python'){
            output = await executePy(filePath, inputPath);
        }
        else {
            output = await executeJava(filePath, inputPath);
        }
        res.json({ filePath, inputPath, output });
    } catch (error) {
        console.error('Backend error:', error); // Log the complete error for debugging
        res.status(500).json({ error: error.error || 'segmentation fault' ,stderr: error.stderr });
      }
});

app.listen(8000, () => {
    console.log("Server is listening on port 8000!");
});