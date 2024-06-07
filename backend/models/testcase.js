// models/Testcase.js
const mongoose = require('mongoose');

const testcaseSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  inputs: {
    type: [String],
    required: true
  },
  outputs: {
    type: [String],
    required: true
  }
});

const Testcase = mongoose.model('Testcase', testcaseSchema);

module.exports = Testcase;
