if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();

const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./passportConfig');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const { pool } = require('./dbConfig');
const path = require("path");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;

//Routes
const routesRouter = require('./routes/routes');
const carsRouter = require('./routes/cars');
const usersRouter = require('./routes/user');
const gasstationRouter = require('./routes/gasstation');
const tankstopsRouter = require('./routes/tankstops');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(flash());

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const users = [];

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

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', checkAuthenticated, (req, res, next) => {
    res.render('index.ejs', { name: req.user.email });
})

app.get('/login', checkNotAuthenticated, (req, res, next) => {
    res.render('login.ejs');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res, next) => {
    res.render('register.ejs');
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
})

app.post('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
})

app.get('/test', checkAuthenticated, (req, res, next) => {
    const user = req.user;
    res.status(200).send(user);
})

app.use('/routes', checkAuthenticated, routesRouter);
app.use('/cars', checkAuthenticated, carsRouter);
app.use('/users', checkAuthenticated, usersRouter);
app.use('/gasstations', checkAuthenticated, gasstationRouter);
app.use('/tankstops', checkAuthenticated, tankstopsRouter);

//Error handling
app.use(function (err, req, res, next) {
    res.status(500).send({ error: 'something broke' });
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

//functions
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}