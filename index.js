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
    cookie: { path: '/', httpOnly: false, secure: false, maxAge: 100 * 60 * 60 * 24 }
}));

//Routes
const routesRouter = require('./routes/routes');
const carsRouter = require('./routes/cars');
const usersRouter = require('./routes/user');
const gasstationRouter = require('./routes/gasstation');
const tankstopsRouter = require('./routes/tankstops');
const authLocal = require('./routes/auth/local');

app.get('/', (req, res, next) => {
    res.render('index.ejs', { userID: req.user.id });
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

