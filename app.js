const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandler');
const authController = require('./controllers/authController');
const expressValidator = require('express-validator');
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

// Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
// app.use(expressValidator());
// Takes the raw requests and turns them into usable properties on req.body
// app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: true }));
//we need this app.use(express.urlencoded({ extended: false }))because forms submit  as HTML POST using Content-Type: application/x-www-form-urlencoded.
// app.use(express.urlencoded({ extended: false }))

// app.use((req, res, next) => {
//     // console.log(req.headers)
//     next();
// });

// pass variables to our templates + all requests
// app.use((req, res, next) => {
//     res.locals.user = req.user || null;
//     res.locals.currentPath = req.path;
//     next();
// });

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    res.locals.user = req.user || null;
    // console.log(res.locals.user);
    next();
});

// app.use(authController.isLoggedIn)

app.use('/', routes);

app.use(errorHandlers.notFound);


// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.validationErrors);

// if (app.get('env') === 'development') {
//     /* Development Error Handler - Prints stack trace */
//     app.use(errorHandlers.developmentErrors);
// };

// production error handler
// app.use(errorHandlers.productionErrors);

module.exports = app;