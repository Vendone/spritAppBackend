const express = require('express');
const routesRouter = express.Router();
const { pool } = require('../dbConfig');

routesRouter.get('/', (req, res, next) => {
    pool.query('SELECT * FROM routes', (err, results) => {
        if (err) {
            next(err);
        } else {
            let routes = results.rows;
            const route = routes;
            res.status(200).send(route);
        }
    });
})

module.exports = routesRouter;