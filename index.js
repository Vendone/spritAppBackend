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

//CORS
// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


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