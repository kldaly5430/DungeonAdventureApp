const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected home route
router.get('/', authMiddleware, (req, res) => {
    res.json({ message: 'Welcome to the protected home page!' });
});

module.exports = router;