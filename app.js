const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const routes = require('./routes/index');
const { globalErrorHandler } = require('./handlers/errorHandler');
const authController = require('./controllers/authController');
const expressValidator = require('express-validator');
const AppError = require('./helpers/newError');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const promisify = require('promisify');
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
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));

// app.use(express.json());
// // express.urlencoded allows us to send data from forms to the server side
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());


// app.use(bodyParser.urlencoded({ extended: true }));
//we need this app.use(express.urlencoded({ extended: false }))because forms submit  as HTML POST using Content-Type: application/x-www-form-urlencoded.
// app.use(express.urlencoded({ extended: false }))


// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    res.locals.user = req.user || null;
    // console.log(res.locals.user);
    next();
});

// app.use(authController.isLoggedIn)

app.use('/', routes);

// if no route is found
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// pass on to other routes
app.use(globalErrorHandler);


module.exports = app;