const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandler');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');



// app.engine('pug', require('pug').renderFile);
// view engine setup
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
// app.use(expressValidator());
// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
//we need this app.use(express.urlencoded({ extended: false }))because forms submit  as HTML POST using Content-Type: application/x-www-form-urlencoded.
app.use(express.urlencoded({ extended: false }))

app.use('/', routes);

app.use(errorHandlers.notFound);


// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

if (app.get('env') === 'development') {
    /* Development Error Handler - Prints stack trace */
    app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

module.exports = app;