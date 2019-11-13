/* Node Dependencies */
const path = require('path');
const fs = require('fs');

/* Project Main Dependencies */
const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const helmet = require('helmet');
const createError = require('http-errors');

/* Routes */
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

/* Session & Database configuration */
const {Model} = require('objection');
const KnexSessionStore = require('connect-session-knex')(session);
const knex = require('./db/config');
Model.knex(knex);

/* Start Express App */
const app = express();
app.set('trust proxy', 1); // trust first proxy


/* View engine setup */
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

/* Middleware */
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
app.use(express.urlencoded({extended: false}));
app.use(
    session({
        store: new KnexSessionStore({knex, tablename: 'sessions'}),
        resave: true,
        saveUninitialized: true,
        secret: '@@W@@', //TODO: Change it for production
        name: ']cUpQwIOA~gLUedE/`u6DHzI"{j$f;',
        cookie: {
            signed: true,
            maxAge: 30000 // 30 seconds for testing
        }
    })
);

/* Serve static files from public folder */
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/* Catch 404 and forward to error handler */
app.use(function (req, res, next) {
    next(createError(404));
});

/* Error Handler */
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
