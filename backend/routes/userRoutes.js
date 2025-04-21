//routes/userROutes
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Submission = require('../models/Submission'); // path may vary


// JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from the Authorization header
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token is required' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.userId = decoded.id; // Store user ID for use in the route handler
    next();
  });
};

// Register route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.status(201).json({ success: true, token, message: 'Registration successful' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



// Submit code route
router.post('/submit', verifyToken, async (req, res) => {
  const submission = new Submission({
    userId: req.userId, // This should come from the token
    testCases: req.body.testCases,
    code: req.body.code,
    expectedOutput: req.body.expectedOutput,
    verdict: 'Pending', // For example
    timestamp: new Date(),
  });

  try {
    await submission.save();
    res.status(200).json({ success: true, message: 'Submission saved successfully' });
  } catch (err) {
    console.error('Error saving submission:', err);
    res.status(500).json({ success: false, message: 'Error saving submission' });
  }
});



router.get('/my-submissions', verifyToken, async (req, res) => {
  const userId = req.userId;

  console.log('User ID:', req.userId);


  try {
    const submissions = await Submission.find({ userId })
      .populate('problemId', 'name')
      .sort({ createdAt: -1 });

    if (submissions.length === 0) {
      return res.status(200).json({ message: 'No submissions found' });
    }

    res.json(submissions);
  } catch (err) {
    console.error('Error fetching submissions:', err.message, err.stack);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
