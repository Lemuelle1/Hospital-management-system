// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// This matches the "Sign in" action
router.post('/signup', authController.registerPatient);
module.exports = router;

router.post('/login', authController.login);
