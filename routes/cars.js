const express = require('express');
const carsRouter = express.Router();
const { getDataById, postData, putById, deleteById } = require('../dbquerys');

carsRouter.get('/:id', async (req, res, next) => {
    const response = await getDataById('cars', req.params.id);
    res.status(200).send(response);
})

carsRouter.post('/', async (req, res, next) => {
    const { license_plate, brand, modell, fuel, mileage, construction_year, description, user_id } = req.body;
    const response = await postData('cars', 'license_plate, brand, modell, fuel, mileage, construction_year, description, user_id', [license_plate, brand, modell, fuel, mileage, construction_year, description, user_id]);
    res.status(200).send(response);
})

carsRouter.put('/:id', async (req, res, next) => {
    const { license_plate, brand, modell, fuel, mileage, construction_year, description } = req.body;
    const id = req.params.id;
    const response = await putById('cars', ['license_plate', 'brand', 'modell', 'fuel', 'mileage', 'construction_year', 'description'], [license_plate, brand, modell, fuel, mileage, construction_year, description, req.params.id]);
    res.status(201).send(response);
})

carsRouter.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    const response = await deleteById('cars', id);
    res.status(200).send(response);
})

module.exports = carsRouter;