// controllers/testcaseController.js
const Testcase = require('../models/testcase');

// Get test cases by problem ID
exports.getTestcases = async (req, res) => {
  try {
    const testcases = await Testcase.findOne({ problemId: req.params.id });
    if (!testcases) {
      return res.status(404).json({ message: 'No test cases found for this problem' });
    }
    res.json(testcases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new test cases
exports.createTestcase = async (req, res) => {
  const { problemId, inputs, outputs } = req.body;
  try {
    const newTestcase = new Testcase({ problemId, inputs, outputs });
    await newTestcase.save();
    res.status(201).json(newTestcase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update existing test cases
exports.updateTestcase = async (req, res) => {
  const { inputs, outputs } = req.body;
  try {
    const testcase = await Testcase.findOneAndUpdate(
      { problemId: req.params.id },
      { inputs, outputs },
      { new: true }
    );
    if (!testcase) {
      return res.status(404).json({ message: 'No test cases found for this problem' });
    }
    res.json(testcase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
