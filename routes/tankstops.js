const express = require('express');
const tankstopsRouter = express.Router();
const { pool } = require('../dbConfig');

tankstopsRouter.get('/', (req, res, next) => {
    pool.query('SELECT * FROM tank_stops WHERE user_id = 1', (err, results) => {
        if (err) {
            next(err);
        } else {
            let tankstops = results.rows;
            const tankstop = tankstops;
            res.status(200).send(tankstop);
        }
    });
})

tankstopsRouter.post('/', (req, res, next) => {
    const { gasstation_id, fuel, amount, price, milage, date, user_id, car_id } = req.body;
    pool.query('INSERT INTO tank_stops (gasstation_id, fuel, amount, price, milage, date, user_id, car_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [gasstation_id, fuel, amount, price, milage, date, user_id, car_id],
        (err, results) => {
            if (err) {
                next(err);
            } else {
                res.status(201).send('ok');
            }
        })
})

tankstopsRouter.put('/:id', (req, res, next) => {
    const { gasstation_id, fuel, amount, price, milage, date, user_id, car_id } = req.body;
    pool.query('UPDATE tank_stops SET gasstation_id = $1, fuel = $2, amount = $3, price = $4, milage = $5, date = $6, user_id = $7, car_id = $8 WHERE id = $9',
        [gasstation_id, fuel, amount, price, milage, date, user_id, car_id, req.params.id],
        (err, results) => {
            if (err) {
                next(err);
            } else {
                res.status(201).send({ ok: 'ok' });
            }
        });
})

tankstopsRouter.delete('/:id', (req, res, next) => {
    pool.query('DELETE FROM tank_stops WHERE id=$1', [req.params.id], (err, results) => {
        if (err) {
            next(err);
        } else {
            res.status(200).send({ ok: 'ok' });
        }
    });
})

module.exports = tankstopsRouter;