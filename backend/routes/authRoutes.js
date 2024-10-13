// routes/authRoutes.js
const express = require('express');
const { login, validateOTP } = require('../controllers/authController');
const router = express.Router();

router.post('/mlogin', login);           // Endpoint for sending OTP using Supabase
router.post('/otp/validate', validateOTP); // Endpoint for validating OTP with Supabase

module.exports = router;
