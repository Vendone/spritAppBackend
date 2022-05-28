const express = require('express');
const app = express();
const { pool } = require('./dbConfig');
require("dotenv").config();

const session = require('express-session');
const store = new session.MemoryStore();
const passport = require('passport');
const initializePassport = require('./passportConfig');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(session({
    secret: SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60, secure: true, sameSite: 'none' }, // eine Stunde
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res, next) => {
    res.render('index');
})

app.post('/test', (req, res, next) => {
    const { username, password } = req.body;
    if (username && password) {
        //nach User authentification
        //hier kann hinzugefügt werden was man will
        req.session.authenticated = true;
        req.session.user = { username, password, };
        res.status(200).send(req.session);
    } else {
        res.status(403).send('forbidden');
    }

});
app.use('/routes', authorizedUser, routesRouter);
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

//functions
function authorizedUser(req, res, next) {
    // Check for the authorized property within the session
    if (req.session.authorized) {
        // next middleware function is invoked
        res.next();
    } else {
        res.status(403).json({ msg: "You're not authorized to view this page" });
    }
};