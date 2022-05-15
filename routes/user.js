const express = require('express');
const usersRouter = express.Router();
const { pool } = require('../dbConfig');

usersRouter.get('/', (req, res, next) => {
    pool.query('SELECT id, first_name, last_name, email FROM users', (err, results) => {
        if (err) {
            next(err);
        } else {
            let users = results.rows;
            const user = users;
            res.status(200).send(user);
        }
    });
})

usersRouter.post('/', (req, res, next) => {

    const { first_name, last_name, email, password } = req.body;
    pool.query('INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)',
        [first_name, last_name, email, password],
        (err, results) => {
            if (err) {
                next(err);
            } else {

                res.status(201).send('ok');
            }
        })
})

usersRouter.put('/:id', (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;
    pool.query('UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4 WHERE id = $5',
        [first_name, last_name, email, password, req.params.id],
        (err, results) => {
            if (err) {
                next(err);
            } else {
                res.status(201).send({ ok: 'ok' });
            }
        });
})

usersRouter.delete('/:id', (req, res, next) => {
    pool.query('DELETE FROM users WHERE id=$1', [req.params.id], (err, results) => {
        if (err) {
            next(err);
        } else {
            res.status(200).send({ ok: 'ok' });
        }
    });
})

module.exports = usersRouter;