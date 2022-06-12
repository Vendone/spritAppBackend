const express = require('express');
const gasstationsRouter = express.Router();
const { pool } = require('../dbConfig');
const { getData, postData, putById, deleteById } = require('../dbquerys');

gasstationsRouter.get('/', async (req, res, next) => {
    const response = await getData('gasstations');
    res.status(200).send(response);
})

gasstationsRouter.post('/', async (req, res, next) => {
    const { name, location } = req.body;
    const response = await postData('gasstations', 'name, location', [name, location]);
    res.status(200).send(response);
})

gasstationsRouter.put('/:id', async (req, res, next) => {
    const { name, location } = req.body;
    const id = req.params.id;
    const response = await putById('gasstations', ['name', 'location'], [name, location, id]);
    res.status(201).send(response);
})

gasstationsRouter.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    const response = await deleteById('gasstations', id);
    res.status(200).send(response);
})

module.exports = gasstationsRouter;