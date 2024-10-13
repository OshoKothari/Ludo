// controllers/authController.js

const supabase = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const db = require('../config/database'); // Import the database configuration
require('dotenv').config(); // Load environment variables

// Initialize Supabase client with URL and Key from environment variables
const supabaseClient = supabase.createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Function to initiate OTP-based login using Supabase
exports.login = async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    try {
        // Use Supabase to send OTP to the provided phone number
        const { error } = await supabaseClient.auth.signInWithOtp({
            phone,
            options: {
                shouldCreateUser: true,  // Creates a new user if they don't already exist
            }
        });

        if (error) {
            console.error('Supabase OTP error:', error);
            return res.status(500).json({ error: 'Failed to send OTP' });
        }

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ error: 'Failed to generate OTP' });
    }
};

// Function to validate the OTP using Supabase and issue a JWT upon successful validation

exports.validateOTP = async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    try {
        const { data, error } = await supabaseClient.auth.verifyOtp({
            phone,
            token: otp,
            type: 'sms'
        });

        if (error || !data) {
            console.error('Supabase OTP verification error:', error);
            return res.status(401).json({ error: 'Invalid OTP or verification failed' });
        }

        const userId = data.user.id;

        const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [userId]);
        if (userCheck.rows.length === 0) {
            await db.query('INSERT INTO users (id, phone) VALUES ($1, $2)', [userId, phone]);
            console.log(`New user with ID ${userId} added to the database.`);
        }

        const token = jwt.sign({ user_id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ access_token: token });
    } catch (error) {
        console.error('Error validating OTP:', error);
        res.status(500).json({ error: 'Failed to validate OTP' });
    }
};