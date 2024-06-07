// routes/testcaseRoutes.js
const express = require('express');
const { getTestcases, createTestcase, updateTestcase } = require('../controllers/testcaseController');
const router = express.Router();

router.get('/testcases/:id', getTestcases);
router.post('/testcases', createTestcase);
router.put('/testcases/:id', updateTestcase);

module.exports = router;
