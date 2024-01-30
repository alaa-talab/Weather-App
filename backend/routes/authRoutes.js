const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { loginInput, password } = req.body;

    try {
        // Check if loginInput is an email or username
        const isEmail = loginInput.includes('@');
        const query = isEmail ? { email: loginInput } : { username: loginInput };

        const user = await User.findOne(query);

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Assuming you're using JWT for tokens
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Make sure you have your JWT secret in your environment variables
            { expiresIn: '1h' }, // Token expiration time
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { username } = req.body; // Add other updatable fields
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { username }, { new: true }).select('-password');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
