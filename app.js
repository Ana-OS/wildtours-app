const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const routes = require('./routes/index');
const { globalErrorHandler } = require('./handlers/errorHandler');
const AppError = require('./helpers/newError');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
// const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');


app.use(cors())
// Set security HTTP headers
// app.use(helmet());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));

// app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());


// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    res.locals.user = req.user || null;
    // console.log(res.locals.user);
    next();
});

app.use('/', routes);

// if no route is found
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// pass on to other routes
app.use(globalErrorHandler);


module.exports = app;