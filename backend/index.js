const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { poolPromise } = require('./config/db');

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));

const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const timerRoutes = require('./routes/timerRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/timer', timerRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});