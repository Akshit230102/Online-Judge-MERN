const Submission = require('../models/submissions');

exports.postSubmission = async(req, res)=>{

    const { userId , code, verdict, problemId } = req.body;

  try {
    let submission = await Submission.findOne({ user: userId, problemId: problemId });

    if (submission) {
      submission.codes.push(code);
      submission.verdicts.push(verdict);
    } else {
      submission = await Submission.create({
        user: userId,
        problemId,
        codes: [code],
        verdicts: [verdict],
      });
    }

    await submission.save();
    res.status(201).json({ message: 'Submission saved successfully' });
  } catch (error) {
    console.log({userId: userId, code: code, verdict: verdict, problemId: problemId});
    res.status(500).json({ message: 'Error saving submission', error });
  }
};

exports.getSubmission = async(req, res)=>{

  const {userId, problemId} = req.query;
  //const {problemId} = req.params;

  try {
    const submission = await Submission.findOne({ user: userId, problemId: problemId });

    if (!submission) {
      return res.status(404).json({ message: 'No submissions found',
        userId: userId,
        problemId: problemId,
      });
    }

    else {
      return res.status(200).json(submission);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving submissions', error });
  }
};

