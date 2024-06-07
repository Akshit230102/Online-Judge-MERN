const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.post('/register', authController.registration);
router.post('/login', authController.login);

module.exports = router;
