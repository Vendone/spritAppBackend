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
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
app.use(cors({
    origin: [process.env.SERVER_URL, process.env.FRONTEND_URL],
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
    cookie: { path: '/', httpOnly: false, secure: true, sameSite: 'none', maxAge: 100 * 60 * 60 * 24 }
}));

app.use(expressCspHeader({
    directives: {
        'default-src': [SELF],
        'script-src': [SELF, INLINE, process.env.FRONTEND_URL, 'https://kit.fontawesome.com'],
        'style-src': [SELF, process.env.FRONTEND_URL],
        'img-src': ['data:', process.env.SERVER_URL],
        'worker-src': [NONE],
        'block-all-mixed-content': true
    }
}));

//Routes
const routesRouter = require('./routes/routes');
const carsRouter = require('./routes/cars');
const usersRouter = require('./routes/user');
const gasstationRouter = require('./routes/gasstation');
const tankstopsRouter = require('./routes/tankstops');
const authLocal = require('./routes/auth/local');

app.get('/', (req, res, next) => {
    res.status(200).send('Hi there, I`m fine.');
})

app.use('/routes', routesRouter)
app.use('/cars', carsRouter)
app.use('/user', usersRouter)
app.use('/gasstations', gasstationRouter)
app.use('/tankstops', tankstopsRouter)
app.use('/auth', authLocal)

app.get('/test', async (req, res, next) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM gasstations');
        const results = { 'results': (result) ? result.rows : null };
        res.status(200).send(results);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
})

//Error handling
app.use(function (err, req, res, next) {
    res.status(500).send({ error: 'something broke' });
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

