const express = require('express');
const usersRouter = express.Router();
const { pool } = require('../dbConfig');
const passport = require('passport');
const initializePassport = require('../passportConfig');
const bcrypt = require('bcrypt');

usersRouter.get('/', (req, res, next) => {
    pool.query('SELECT id, first_name, last_name, email FROM users ORDER BY id', (err, results) => {
        let users = results.rows;
        if (err) {
            next(err);
        } else {
            res.status(200).send({ users });
        }
    });
})

usersRouter.get('/register', checkAuthenticated, (req, res, next) => {
    res.render('register');
})

usersRouter.get('/logout', (req, res, next) => {
    req.logout();
    res.status(200).send({ msg: 'Logged out' });
});

usersRouter.post('/register', async (req, res, next) => {
    if (req.body.password == undefined) {
        next(err);
    } else {
        let { first_name, last_name, email, password, confirm_password } = req.body;
        let errors = [];

        if (!first_name || !last_name || !email || !password || !confirm_password) {
            errors.push({ message: 'Please enter all fields' });
        }

        if (password.length < 6) {
            errors.push({ message: 'Password shoult be at least 6 characters' });
        }

        if (password !== confirm_password) {
            errors.push({ message: 'Passwords do not match' });
        }

        if (errors.length > 0) {
            res.status(403).send({ errors });
        } else {
            //Form validation has passed
            let hashedPassword = await bcrypt.hash(password, 10);

            pool.query('SELECT * FROM users WHERE email = $1', [email], (err, results) => {
                if (err) {
                    next(err);
                }

                if (results.rows.length > 0) {
                    errors.push({
                        message: "Email already registered"
                    });
                    res.status(403).send({ errors });
                } else {
                    pool.query('INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, password', [first_name, last_name, email, hashedPassword], (err, results) => {
                        if (err) {
                            next(err);
                        }
                        res.status(201).send({ "message": 'successful created' });
                    });
                }
            });
        }
    }
});

usersRouter.post('/login', passport.authenticate('local', {
    failureRedirect: '/login'
}), (req, res) => {
    res.json(req.session);
});

usersRouter.get('/:id', (req, res, next) => {
    pool.query('SELECT first_name, last_name, email FROM users WHERE id = $1', [req.params.id], (err, results) => {
        if (err) {
            next(err);
        }
        if (results.rows.length < 1) {
            res.status(404).send({ error: 'User not found' });
        } else {
            let user = results.rows;
            res.status(200).send(user);
        }
    });
})

usersRouter.put('/:id', (req, res, next) => {
    let errors = [];
    const { first_name, last_name, email, password, confirm_password } = req.body;

    if (!first_name || !last_name || !email || !password || !confirm_password) {
        errors.push({ message: 'Please enter all fields' });
    }

    if (req.body.password.length < 6) {
        errors.push({ message: 'Password shoult be at least 6 characters' });
    }

    if (req.body.password !== req.body.confirm_password) {
        errors.push({ message: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        res.status(403).send({ errors });
    }

    //Form validation has passed
    let hashedPassword = bcrypt.hashSync(req.body.password, 10);
    pool.query('UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4 WHERE id = $5', [first_name, last_name, email, hashedPassword, req.params.id]);
    res.status(201).send({ status: 'Userdata changed' });
})

usersRouter.delete('/:id', (req, res, next) => {
    pool.query('DELETE FROM users WHERE id=$1', [req.params.id], (err, results) => {
        if (err) {
            next(err);
        } else {
            res.status(200).send({ status: 'User deleted' });
        }
    });
})

// functions
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.status(201).send({ "message": 'successful created' });
    }
    next();
}

function checkNotAutenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
}

module.exports = usersRouter;