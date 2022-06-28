const express = require('express');
const routesRouter = express.Router();
const { getDataById, getAvgFuelById, postData, putById, deleteById } = require('../dbquerys');
const { check, validationResult } = require('express-validator');

routesRouter.get('/', async (req, res, next) => {
    const response = await getDataById('routes', 1);
    res.status(200).send(response);
})

routesRouter.get('/avgFuel/:id', async (req, res, next) => {
    const response = await getAvgFuelById('routes', req.params.id);
    res.status(200).send(response);
})

routesRouter.post('/', [
    check('start_point').notEmpty().isString().blacklist('<>"/;'),
    check('end_point').notEmpty().isString().blacklist('<>"/;'),
    check('mileage_start').notEmpty().isNumeric().blacklist('<>"/;'),
    check('mileage_stop').notEmpty().isNumeric().blacklist('<>"/;'),
    check('avg_fuel_consumption').notEmpty().isNumeric().blacklist('<>"/;'),
    check('user_id').notEmpty().isNumeric().blacklist('<>"/;'),
    check('car_id').notEmpty().isNumeric().blacklist('<>"/;')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { start_point, end_point, mileage_start, mileage_stop, avg_fuel_consumption, user_id, car_id } = req.body;
    const response = await postData('routes', 'start_point, end_point, mileage_start, mileage_stop, avg_fuel_consumption, user_id, car_id', [start_point, end_point, mileage_start, mileage_stop, avg_fuel_consumption, user_id, car_id]);
    res.status(200).send(response);
})

routesRouter.delete('/', async (req, res, next) => {
    const { id } = req.body;
    const response = await deleteById('routes', id);
    res.status(200).send(response);
})

routesRouter.put('/:id', [
    check('start_point').notEmpty().isString().blacklist('<>"/;'),
    check('end_point').notEmpty().isString().blacklist('<>"/;'),
    check('mileage_start').notEmpty().isNumeric().blacklist('<>"/;'),
    check('mileage_stop').notEmpty().isNumeric().blacklist('<>"/;'),
    check('avg_fuel_consumption').notEmpty().isNumeric().blacklist('<>"/;'),
    check('car_id').notEmpty().isNumeric().blacklist('<>"/;')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { start_point, end_point, mileage_start, mileage_stop, avg_fuel_consumption, car_id } = req.body;
    const id = req.params.id;
    const response = await putById('routes', ['start_point', 'end_point', 'mileage_start', 'mileage_stop', 'avg_fuel_consumption', 'car_id'], [start_point, end_point, mileage_start, mileage_stop, avg_fuel_consumption, car_id, req.params.id]);
    res.status(201).send(response);
})

module.exports = routesRouter;