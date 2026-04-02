require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'twoem-secret',
    resave: false,
    saveUninitialized: true
}));

// --- Recurring Task Logic ---
const PING_INTERVAL = 5000; // 5 seconds

setInterval(async () => {
    const timestamp = new Date().toLocaleTimeString();
    
    // 1. Simple Log
    console.log(`[${timestamp}] - Interval Check: App is still running.`);

    // 2. Optional: Ping an external URL or your own health check
    /*
    try {
        const response = await fetch(`http://localhost:${PORT}/`);
        console.log(`[${timestamp}] - Self-ping status: ${response.status}`);
    } catch (err) {
        console.error(`[${timestamp}] - Ping failed: ${err.message}`);
    }
    */
}, PING_INTERVAL);
// ----------------------------

// Routes
app.get('/', (req, res) => res.render('landing'));

app.get('/login', (req, res) => res.render('login', { error: null }));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.APP_USER && password === process.env.APP_PASS) {
        req.session.authenticated = true;
        return res.redirect('/dashboard');
    }
    res.render('login', { error: 'Invalid Credentials' });
});

app.get('/dashboard', (req, res) => {
    if (!req.session.authenticated) return res.redirect('/login');
    res.render('dashboard', { user: process.env.APP_USER });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Test App running on port ${PORT}`);
    console.log(`Log updates started every ${PING_INTERVAL / 1000} seconds.`);
});
