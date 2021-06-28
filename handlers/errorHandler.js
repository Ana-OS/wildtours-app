const appError = require('../helpers/newError');

exports.catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/*
  Not Found Error Handler
 
  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

/*
  MongoDB Validation Error Handler

  Detect if there are mongodb validation errors that we can nicely show via flash messages
*/

exports.validationErrors = (err, req, res, next) => {
  console.log("im the validation error")
  // if (process.env.NODE_ENV === 'development') {
  res.json({
    statusCode: err.status,
    message: err.message,
    stack: err.stack
  })

  // next(err)
  // }
  // else if (process.env.NODE_ENV === 'production') {
  //   // Operational, trusted error: send message to client
  //   if (err.isOperational) {
  //     res.status(err.statusCode).json({
  //       status: err.status,
  //       message: err.message
  //     });

  // Programming or other unknown error: don't leak error details
  // } else {
  //   // 1) Log error
  //   console.error('ERROR 💥', err);

  //   // 2) Send generic message
  //   res.status(500).json({
  //     status: 'error',
  //     message: 'Something went very wrong!'
  //   });
  // }
};

// if (!err.errors) return next(err);
// validation errors look like
// const errorKeys = Object.keys(err);
// console.log(errorKeys)
// errorKeys.forEach(key => res.json('error', err.errors[key].message));
// res.redirect('back');
// };


/*
  Development Error Hanlder

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
// exports.developmentErrors = (err, req, res, next) => {
//   err.stack = err.stack || '';
//   const errorDetails = {
//     name: err,
//     message: err.message,
//     status: err.status,
//     stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
//   };
//   res.status(err.status || 500);
//   // res.format({
//   //   // Based on the `Accept` http header
//   //   'text/html': () => {
//   //     res.render('error', errorDetails);
//   //   }, // Form Submit, Reload the page
//   //   'application/json': () => res.json(errorDetails) // Ajax call, send JSON back
//   // });
// };


// /*
//   Production Error Handler

//   No stacktraces are leaked to user
// */
// exports.productionErrors = (err, req, res, next) => {
//   res.status(err.status || 500);
//   // res.send('this is the last catch error')
//   console.log(err)
//   res.status(status).send(body)
// };