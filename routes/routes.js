const express = require('express');
const routesRouter = express.Router();
const { pool } = require('../dbConfig');

routesRouter.get('/', (req, res, next) => {
    pool.query('SELECT * FROM routes', (err, results) => {
        let routes = results.rows;
        if (err) {
            next(err);
        } else {
            res.status(200).send({ routes });
        }
    });
})

module.exports = routesRouter;