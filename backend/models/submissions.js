// models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  codes: [
    {
      type: String,
      required: true,
    }
  ],
  verdicts: [
    {
      type: String,
      required: true,
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
