const express = require('express');
const res = require('express/lib/response');
const routesRouter = express.Router();
const { pool } = require('../dbConfig');

routesRouter.get('/', (req, res, next) => {
    pool.query('SELECT * FROM routes ORDER BY date DESC', (err, results) => {
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

    const { date, start_point, end_point, mileage_start, mileage_stop, avg_fuel_consumption, user_id, car_id } = req.body;
    pool.query('INSERT INTO routes (date, start_point, end_point, mileage_start, mileage_stop, avg_fuel_consumption, user_id, car_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [date, start_point, end_point, mileage_start, mileage_stop, avg_fuel_consumption, user_id, car_id], (err, results) => {
        if (err) {
            next(err);
        } else {
            res.status(201);
        }
    })
})

module.exports = routesRouter;