const express = require('express');
const app = express();
const { pool } = require('./dbConfig');
const PORT = process.env.PORT || 4001;
require("dotenv").config();

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

//Routes
const routesRouter = require('./routes/routes');

const res = require('express/lib/response');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res, next) => {
    res.render('index');
})

app.use('/routes', routesRouter);

//Error handling
app.use(function (err, req, res, next) {
    res.status(500).send({ error: 'something broke' });
});

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
});