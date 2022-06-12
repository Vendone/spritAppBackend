const express = require('express');
const gasstationsRouter = express.Router();
const { pool } = require('../dbConfig');

gasstationsRouter.get('/', (req, res, next) => {
    pool.query('SELECT * FROM gasstations', (err, results) => {
        if (err) {
            next(err);
        } else {
            let users = results.rows;
            const user = users;
            res.status(200).send(user);
        }
    });
})

gasstationsRouter.post('/', (req, res, next) => {
    const { name, location } = req.body;
    pool.query('INSERT INTO gasstations (name, location) VALUES ($1, $2)',
        [name, location],
        (err, results) => {
            if (err) {
                next(err);
            } else {
                res.status(201).send('ok');
            }
        })
})

gasstationsRouter.put('/:id', (req, res, next) => {
    const { name, location } = req.body;
    pool.query('UPDATE gasstations SET name = $1, location = $2 WHERE id = $3',
        [name, location, req.params.id],
        (err, results) => {
            if (err) {
                next(err);
            } else {
                res.status(201).send({ ok: 'ok' });
            }
        });
})

gasstationsRouter.delete('/:id', (req, res, next) => {
    pool.query('DELETE FROM gasstations WHERE id=$1', [req.params.id], (err, results) => {
        if (err) {
            next(err);
        } else {
            res.status(200).send({ ok: 'ok' });
        }
    });
})

module.exports = gasstationsRouter;