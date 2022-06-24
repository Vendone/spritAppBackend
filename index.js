if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const PORT = process.env.PORT;
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const SESSION_SECRET = process.env.SESSION_SECRET;
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

const path = require("path");
const flash = require('express-flash');
const logger = require('morgan');
const { pool } = require('./dbConfig');
const { check, validationResult } = require('express-validator');

app.set('view-engine', 'ejs');
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            'default-src': ["'self'", 'https://ka-f.fontawesome.com/', 'https://fonts.gstatic.com/'],
            'script-src': ["'self'", "'inline'", process.env.FRONTEND_URL, 'https://kit.fontawesome.com'],
            'style-src': ["'self'", "'inline'", process.env.FRONTEND_URL, 'https://fonts.googleapis.com/'],
            'img-src': ['data:', process.env.SERVER_URL]
        }
    },
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }))
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
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
    cookie: { path: '/', httpsOnly: true, secure: true, sameSite: 'none', maxAge: 100 * 60 * 60 * 24 }
}));

// Configure csurf middleware here
const csrfMiddleware = csurf({
    cookie: {
        maxAge: 3000,
        secure: true,
        sameSite: 'none'
    }
});
// Use csrf middleware at application level here
app.use(csrfMiddleware)

// Configure error message middleware here
const errorMessage = (err, req, res, next) => {
    if (err.code == "EBADCSRFTOKEN") {
        res.render('csrfError')
    } else {
        next();
    }
}

app.use(errorMessage)

//Routes
const routesRouter = require('./routes/routes');
const carsRouter = require('./routes/cars');
const usersRouter = require('./routes/user');
const gasstationRouter = require('./routes/gasstation');
const tankstopsRouter = require('./routes/tankstops');
const authLocal = require('./routes/auth/local');

app.get('/', (req, res, next) => {
    res.status(200).send({ msg: 'Hi there, I`m fine.', csrfToken: req.csrfToken() });
})

app.use('/routes', routesRouter)
app.use('/cars', carsRouter)
app.use('/user', usersRouter)
app.use('/gasstations', gasstationRouter)
app.use('/tankstops', tankstopsRouter)
app.use('/auth', authLocal)

//Error handling
app.use(function (err, req, res, next) {
    res.status(500).send({ error: 'something broke' });
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

