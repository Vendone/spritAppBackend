const express = require('express');
const app = express();
const { pool } = require('./dbConfig');
require("dotenv").config();

const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./passportConfig');
const PORT = process.env.PORT || 4001;
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

//Routes
const routesRouter = require('./routes/routes');
const carsRouter = require('./routes/cars');
const usersRouter = require('./routes/user');
const gasstationRouter = require('./routes/gasstation');
const tankstopsRouter = require('./routes/tankstops');

initializePassport(passport);
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

app.use(session({
    secret: 'f498g78jhgkfhj$Gcg',
    cookie: { maxAge: (1000 * 60 * 60 * 24 * 7) }, // eine Woche
    secure: false,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res, next) => {
    res.render('index');
})

app.use('/routes', routesRouter);
app.use('/cars', carsRouter);
app.use('/users', usersRouter);
app.use('/gasstations', gasstationRouter);
app.use('/tankstops', tankstopsRouter);
app.get('/dashboard', (req, res, next) => {
    res.status(200).send('ok');
})
//Error handling
app.use(function (err, req, res, next) {
    res.status(500).send({ error: 'something broke' });
});

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`)
});