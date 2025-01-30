const express = require('express');
const moment = require('moment');
const router = express.Router();

let startTime = '2025-01-30T00:00:00';
let endTime = '2025-02-28T11:59:59';
let remainingTime = 500;
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

router.post('/set', (req,res) => {
    const { start, end } = req.body;

    startTime = moment(start);
    endTime = moment(end);
    remainingTime = endTime.diff(startTime, 'seconds');

    res.json({ message: 'Timer set:', remainingTime });
});

module.exports = router;