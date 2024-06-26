const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.post('/register', authController.registration);
router.post('/login', authController.login);
router.get("/logout", authController.logout);

module.exports = router;
