const express = require('express');
const tankstopsRouter = express.Router();
const { getData, postData, putById, deleteById } = require('../dbquerys');

tankstopsRouter.get('/', async (req, res, next) => {
    const response = await getData('tank_stops');
    res.status(200).send(response);
})

tankstopsRouter.post('/', async (req, res, next) => {
    const { gasstation_id, fuel, amount, price, milage, date, user_id, car_id } = req.body;
    const response = await postData('tank_stops', 'gasstation_id, fuel, amount, price, milage, date, user_id, car_id', [gasstation_id, fuel, amount, price, milage, date, user_id, car_id]);
    res.status(200).send(response);
})

tankstopsRouter.put('/:id', async (req, res, next) => {
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