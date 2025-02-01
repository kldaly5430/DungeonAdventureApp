const express = require('express');
const moment = require('moment');
const { sql, poolPromise } = require('../config/db');
const router = express.Router();

let startTime = '';
let endTime = '';
let remainingTime = 0;
let timerInterval = null;
let timerRunning = false;

router.post('/start', (req,res) => {
    const { start, end } = req.body;

    startTime = moment(start);
    endTime = moment(end);
    remainingTime = endTime.diff(startTime, 'seconds');

    if(!timerRunning) {
        timerInterval = setInterval(() => {
            if(remainingTime > 0) {
                remainingTime--;
            } else {
                clearInterval(timerInterval);
                timerRunning = false;
            }
        }, 1000);
        timerRunning = true;
    }
    res.json({ message: 'Timer Started', remainingTime });
});

router.post('/stop', (req,res) => {
    if(timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
    }
    res.json({ message: 'Timer Stopped', remainingTime });
});

router.get('/time', (req,res) => {
    res.json({ remainingTime, timerRunning});
});

router.get('/getTimer', async (req,res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT TOP 1 * FROM timers ORDER BY id DESC');

        if(result.recordset[0] === 0) {
            return res.status(400).json({ message: 'No Timer settings found'});
        } else {
            const startTimeUTC = new Date(result.recordset[0].start_time).toISOString();
            const endTimeUTC = new Date(result.recordset[0].end_time).toISOString();
            res.json({ start_time: startTimeUTC, end_time: endTimeUTC });
        }
        
    } catch (err) {
        console.error("Error fetching timer settings:", err);
        res.status(500).json({ err: "Failed to fetch timer settings" });
    }
});

router.post('/set', (req,res) => {
    const { start, end } = req.body;

    startTime = moment(start);
    endTime = moment(end);
    remainingTime = endTime.diff(startTime, 'seconds');

    res.json({ message: 'Timer set:', remainingTime });
});

router.post('setTimer', async (req,res) => {
    try {
        const { start_time, end_time } = req.body;

        const pool = await poolPromise;
        await pool.request()
            .input('start_time', sql.DateTime, start_time)
            .input('end_time', sql.DateTime, end_time)
            .query('INSERT INTO timers (start_time, end_time) VALUES (@start_time, @end_time');

        res.json({message:"Timer set successfully"});
    } catch (err) {
        console.error("Error setting timer:", error);
        res.status(500).json({ error: "Failed to set timer" });
    }
});

module.exports = router;