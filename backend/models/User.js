const mssql = require('mssql');
const bcrypt = require('bcrypt');
const { sql, poolPromise } = require('../config/db');

async function registerUser(email, password) {
    try {
        const pool = await poolPromise;
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.request()
            .input('email', mssql.VarChar, email)
            .input('password', mssql.VarChar, hashedPassword)
            .query('INSERT INTO Users (email, password) VALUES (@email, @password)');

        return {success: true, message: 'User registered successfully'};
    } catch (err) {
        console.error("Error registering user:", err);
        return {success: false, message: 'Error registering user'};
    }
}

async function authenticateUser(email, password) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', mssql.VarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');

        if (result.recordset.length === 0) {
            return {success: false, message: 'User not found'};
        }

        const storedPassword = result.recordset[0].password;
        const passwordMatch = await bcrypt.compare(password, storedPassword);

        if (!passwordMatch) {
            return {success: false, message: 'Invalid password'};
        }

        return {success: true, message: 'User authenticated'};
    } catch (err) {
        console.error("Error authenticating user:", err);
        return {success: false, message: 'Error authenticating user'};
    }
}

module.exports = { registerUser, authenticateUser };