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

// Routes
app.get('/', (req, res) => res.render('landing'));

app.get('/login', (req, res) => res.render('login', { error: null }));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Checking against ENV variables
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
app.listen(PORT, () => console.log(`Test App running on port ${PORT}`));
