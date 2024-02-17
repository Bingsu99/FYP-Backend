// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const emailClient = require('../util/emailService')
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const registrationTokenController = require('../controllers/RegistrationTokenController')

const tokenController = new registrationTokenController()

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '60m', // Change this to your desired expiration time
    });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '90d', // Change this to your desired expiration time
    });

    const cookieOptions = {
      httpOnly: true,
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/access-token', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    // Check if the refresh token exists
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

      // Generate a new access token
      const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: '60m', // Change this to your desired expiration time
      });

      // Send a new access token
      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
