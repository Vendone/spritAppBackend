const express = require('express');
const tankstopsRouter = express.Router();
const { getData, getDataOrderBy, postData, putById, deleteById } = require('../dbquerys');
const { check, validationResult } = require('express-validator');

tankstopsRouter.get('/', async (req, res, next) => {
    const response = await getDataOrderBy('tank_stops', 'date DESC');
    res.status(200).send(response);
})

tankstopsRouter.post('/', [
    check('gasstation_id').isNumeric().blacklist('<>"/;'),
    check('fuel').notEmpty().isString().blacklist('<>"/;'),
    check('amount').isNumeric().blacklist('<>"/;'),
    check('price').isNumeric().blacklist('<>"/;'),
    check('milage').isNumeric().blacklist('<>"/;'),
    check('date').isISO8601().toDate(),
    check('user_id').isNumeric().blacklist('<>"/;'),
    check('car_id').isNumeric().blacklist('<>"/;')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { gasstation_id, fuel, amount, price, milage, date, user_id, car_id } = req.body;
    const response = await postData('tank_stops', 'gasstation_id, fuel, amount, price, milage, date, user_id, car_id', [gasstation_id, fuel, amount, price, milage, date, user_id, car_id]);
    res.status(200).send(response);
})

tankstopsRouter.put('/:id', [
    check('gasstation_id').isNumeric().blacklist('<>"/;'),
    check('fuel').notEmpty().isString().blacklist('<>"/;'),
    check('amount').isNumeric().blacklist('<>"/;'),
    check('price').isNumeric().blacklist('<>"/;'),
    check('milage').isNumeric().blacklist('<>"/;'),
    check('date').isISO8601().toDate(),
    check('user_id').isNumeric().blacklist('<>"/;'),
    check('car_id').isNumeric().blacklist('<>"/;')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { gasstation_id, fuel, amount, price, milage, date, user_id, car_id } = req.body;
    const id = req.params.id;
    const response = await putById('tank_stops', ['gasstation_id', 'fuel', 'amount', 'price', 'milage', 'date', 'user_id', 'car_id'], [gasstation_id, fuel, amount, price, milage, date, user_id, car_id, req.params.id]);
    res.status(201).send(response);
})

tankstopsRouter.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    const response = await deleteById('tank_stops', id);
    res.status(200).send(response);
})

module.exports = tankstopsRouter;