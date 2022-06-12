const express = require('express');
const gasstationsRouter = express.Router();
const { pool } = require('../dbConfig');

gasstationsRouter.get('/', async (req, res, next) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM gasstations');
        const results = { 'results': (result) ? result.rows : null };
        res.status(200).send(results);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
})

gasstationsRouter.post('/', async (req, res, next) => {
    const { name, location } = req.body;
    try {
        const client = await pool.connect();
        const result = await client.query('INSERT INTO gasstations (name, location) VALUES ($1, $2)', [name, location]);
        res.status(201).send('ok');
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
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