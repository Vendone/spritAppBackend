const express = require('express');
const routesRouter = express.Router();
const { pool } = require('../dbConfig');

routesRouter.get('/', (req, res, next) => {
    const user = req.session.passport.user.id;
    console.log(user);
    pool.query('SELECT * FROM routes WHERE user_id = $1', [user], (err, results) => {
        if (err) {
            next(err);
        } else {
            let routes = results.rows;
            const route = routes;
            res.status(200).send(route);
        }
    });
})

routesRouter.post('/', (req, res, next) => {

    const { start_point, end_point, mileage_start, mileage_stop, avg_fuel_consumption, user_id, car_id } = req.body;
    pool.query('INSERT INTO routes (start_point, end_point, mileage_start, mileage_stop, avg_fuel_consumption, user_id, car_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [start_point, end_point, mileage_start, mileage_stop, avg_fuel_consumption, user_id, car_id],
        (err, results) => {
            if (err) {
                next(err);
            } else {
                res.status(201).send({ ok: 'ok' });
            }
        })
})

routesRouter.put('/:id', (req, res, next) => {
    const { start_point, end_point, mileage_start, mileage_stop, avg_fuel_consumption, car_id } = req.body;
    pool.query('UPDATE routes SET start_point = $1, end_point = $2, mileage_start = $3, mileage_stop = $4, avg_fuel_consumption= $5, car_id= $6 WHERE id = $7',
        [start_point, end_point, mileage_start, mileage_stop, avg_fuel_consumption, car_id, req.params.id],
        (err, results) => {
            if (err) {
                next(err);
            } else {
                res.status(201).send({ ok: results });
            }
        });
})

routesRouter.delete('/:id', (req, res, next) => {
    pool.query('DELETE FROM routes WHERE id=$1', [req.params.id], (err, results) => {
        if (err) {
            next(err);
        } else {
            let routes = results.rows;
            const route = routes;
            res.status(200).send(route);
        }
    });
})

routesRouter.get('/test', (req, res, next) => {
    const user = req.session.passport.user.id;
    res.status(200).send({ user });
})

module.exports = routesRouter;