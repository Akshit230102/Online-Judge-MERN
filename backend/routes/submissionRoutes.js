const express = require('express');
const router = express.Router();
// const verifyToken = require("../Middlewares/authMiddleware/verifyToken");
const submissionController = require("../controllers/submissionController");

router.post("/submissions", submissionController.postSubmission);
router.get("/getsubmissions" ,submissionController.getSubmission);

module.exports = router;