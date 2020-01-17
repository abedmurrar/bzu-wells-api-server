/* Project Main Dependencies */
const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const helmet = require('helmet');
const createError = require('http-errors');
const cors = require('cors');
const path = require('path');

/* Session & Database configuration */
const { Model } = require('objection');
const KnexSessionStore = require('connect-session-knex')(session);
const { wellsRouter, usersRouter } = require('./api');
/* Routes */
const knex = require('./db/config');

Model.knex(knex);

/* Start Express App */
const app = express();
app.set('trust proxy', 1); // trust first proxy

/* Middleware */
app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(
    helmet({
        xssFilter: true,
        referrerPolicy: true,
        noSniff: true,
        noCache: false,
        hidePoweredBy: {
            setTo: 'ASP.NET'
        }
    })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        store: new KnexSessionStore({ knex, tablename: 'sessions' }),
        resave: true,
        saveUninitialized: false,
        secret: '@@W@@', // TODO: Change it for production
        name: 'k',
        cookie: {
            signed: true,
            secure: false,
            maxAge:
                1000 /* 1000ms */ *
                60 /* seconds */ *
                60 /* minutes */ *
                24 /* hours */ *
                365 /* days */
        }
    })
);
/* Set up Routers */
app.use('/users', usersRouter);
app.use('/wells', wellsRouter);

/* Catch 404 and forward to error handler */
app.use((req, res, next) => next(createError(404)));

/* Error Handler */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.json({ err, message: err.message });
    // res.render('error');
});

module.exports = app;
