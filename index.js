if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const cors = require('cors');
const path = require("path");
app.use(express.static(path.join(__dirname, 'public')));
const flash = require('express-flash');
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(flash());
const logger = require('morgan');
app.use(logger('dev'));
app.use(express.json());
app.use(cors({
    origin: ['http://192.168.0.233:4001', 'http://192.168.0.233:3000', 'http://localhost:3000', 'http://localhost:4001'],
    credentials: true
}));
const { pool } = require('./dbConfig');
const PORT = process.env.PORT;

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(session({
    secret: SESSION_SECRET,
    store: new pgSession({
        pool: pool,                // Connection pool
        tableName: 'user_sessions'   // Use another table-name than the default "session" one
        // Insert connect-pg-simple options here
    }),
    resave: false,
    saveUninitialized: false,
    sameSite: 'none',
    secure: true,
    cookie: { path: '/', httpOnly: false, secure: false, maxAge: 100 * 60 * 60 * 24 }
}));

//Routes
const routesRouter = require('./routes/routes');
const carsRouter = require('./routes/cars');
const usersRouter = require('./routes/user');
const gasstationRouter = require('./routes/gasstation');
const tankstopsRouter = require('./routes/tankstops');
const authLocal = require('./routes/auth/local');

app.use(passport.initialize());
app.use(passport.session());

app.get('/', checkAuthenticated, (req, res, next) => {
    res.render('index.ejs', { userID: req.user.id });
})

app.get('/login', checkNotAuthenticated, (req, res, next) => {
    res.render('login.ejs');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: 'http://localhost:3000/dashboard',
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
            id: 1,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
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

app.get('/test', async (req, res, next) => {
    try {
        const response = await pool.query('INSERT INTO gasstations (name, location) VALUES ($1, $2)', ['test', 'test']);
        res.status(200).send({ ok: 'ok' });
    } catch (error) {
        res.status(500).send(error);
    }
})

//Error handling
app.use(function (err, req, res, next) {
    res.status(500).send({ error: 'something broke' });
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

