const express = require('express');
const gasstationsRouter = express.Router();
const { pool } = require('../dbConfig');
const { getData, postData, putById, deleteById } = require('../dbquerys');
const { check, validationResult } = require('express-validator');

gasstationsRouter.get('/', async (req, res, next) => {
    const response = await getData('gasstations');
    res.status(200).send(response);
})

gasstationsRouter.delete('/', async (req, res, next) => {
    const { id } = req.body;
    const response = await deleteById('gasstations', id);
    res.status(200).send(response);
})

gasstationsRouter.post('/', [
    check('name').notEmpty().isString().blacklist('<>"/;'),
    check('location').notEmpty().isString().blacklist('<>"/;')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, location } = req.body;
    const response = await postData('gasstations', 'name, location', [name, location]);
    res.status(200).send(response);
})

gasstationsRouter.put('/:id', [
    check('name').notEmpty().isString().blacklist('<>"/;'),
    check('location').notEmpty().isString().blacklist('<>"/;')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, location } = req.body;
    const id = req.params.id;
    const response = await putById('gasstations', ['name', 'location'], [name, location, id]);
    res.status(201).send(response);
})

module.exports = gasstationsRouter;