const express = require('express');
const authRouter = express.Router();
const { pool } = require('../../dbConfig');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { getData, postData, putById, deleteById } = require('../../dbquerys');

passport.use(new LocalStrategy(function verify(username, password, done) {
    pool.query('SELECT * FROM users WHERE email = $1', [username], (error, results) => {
        if (error) {
            return done(error);
        }
        if (!results.rows[0]) {
            return done(null, false, { message: 'Incorrect email' })
        }

        if (!bcrypt.compareSync(password, results.rows[0].password)) {
            return done(null, false, { message: 'Incorrect password' })
        }
        return done(null, results.rows[0]);
    });
}));

passport.serializeUser(function (user, done) {
    done(null, { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name });
});

passport.deserializeUser(function (user, done) {
    return done(null, user);
});

authRouter.use(passport.initialize());
authRouter.use(passport.session());

authRouter.get('/', (req, res, next) => {

    res.render('index.ejs', { userID: req.user.id });
})

authRouter.get('/login', (req, res, next) => {
    res.render('login.ejs');
})

authRouter.post('/login', passport.authenticate('local', {
    successRedirect: process.env.FRONTEND_URL + '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
}))

authRouter.get('/register', (req, res, next) => {
    res.render('register.ejs');
})

authRouter.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const result = await pool.query('INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)', [req.body.first_name, req.body.last_name, req.body.email, hashedPassword]);
        res.redirect('/auth/login');
    } catch {
        res.redirect('/auth/register');
    }
})

authRouter.post('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/auth/login');
    });
})

module.exports = authRouter;