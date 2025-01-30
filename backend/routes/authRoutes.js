const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { sql, poolPromise } = require('../config/db');
const { registerUser, authenticateUser } = require('../models/User');

const router = express.Router();
const secret = process.env.JWT_SECRET

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const result = await registerUser(email, password);
    res.status(result.success ? 200 : 400).json(result);
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');

        if (result.recordset.length === 0) {
            return res.status(401).json({success: false, message: 'User not found'});
        }

        const storedPassword = result.recordset[0].password;
        const passwordMatch = await bcrypt.compare(password, storedPassword);

        if (!passwordMatch) {
            return res.status(401).json({success: false, message: 'Invalid password'});
        }

        const token = jwt.sign({id: result.recordset[0].id}, secret, {expiresIn: '48h'});

        res.json({ token});
    } catch (err) {
        console.error("Error logging in user:", err);
        res.status(500).json({success: false, message: 'Error logging in user'});
    }
});



module.exports = router;