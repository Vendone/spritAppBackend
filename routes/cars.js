const express = require('express');
const res = require('express/lib/response');
const carsRouter = express.Router();
const { pool } = require('../dbConfig');

carsRouter.get('/', (req, res, next) => {
    pool.query('SELECT * FROM cars ORDER BY id DESC', (err, results) => {
        if (err) {
            next(err);
        } else {
            let cars = results.rows;
            const car = cars;
            res.status(200).send(car);
        }
    });
})

carsRouter.post('/', (req, res, next) => {

    const { license_plate, brand, modell, fuel, mileage, construction_year, description } = req.body;
    pool.query('INSERT INTO cars (license_plate, brand, modell, fuel, mileage, construction_year, description, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [license_plate, brand, modell, fuel, mileage, construction_year, description, 1],
        (err, results) => {
            if (err) {
                next(err);
            } else {
                res.status(201).send({ ok: 'ok' });
            }
        })
})

carsRouter.put('/:id', (req, res, next) => {
    const { license_plate, brand, modell, fuel, mileage, construction_year, description } = req.body;
    pool.query('UPDATE cars SET license_plate = $1, brand = $2, modell = $3, fuel = $4, mileage= $5, construction_year= $6 , description= $7 WHERE id = $8',
        [license_plate, brand, modell, fuel, mileage, construction_year, description, req.params.id],
        (err, results) => {
            if (err) {
                next(err);
            } else {
                res.status(201).send({ ok: results });
            }
        });
})

carsRouter.delete('/:id', (req, res, next) => {
    pool.query('DELETE FROM cars WHERE id=$1', [req.params.id], (err, results) => {
        if (err) {
            next(err);
        } else {
            let cars = results.rows;
            const car = cars;
            res.status(200).send(car);
        }
    });
})

module.exports = carsRouter;