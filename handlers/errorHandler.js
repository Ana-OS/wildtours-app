const AppError = require('../helpers/newError');

exports.catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

const handleCastErrorDB = err => {
  const message = "Invalid path !";
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};


const devError = (err, req, res) => {

  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};


const prodError = (err, req, res) => {
  console.log(err.message)
  if (err.message.startsWith("Duplicate field")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else if (err.message.startsWith('incorrect email or password.')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else if (err.isOperational) {
    return res.render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }

  // // 1) Log error
  console.error('ERROR 💥', err);
  //  2) Send generic message
  if (err.message.startsWith("Cannot read property 'length'")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    return res.render('error', {
      title: 'Something went wrong!',
      msg: "please try again later!"
    });
  }
}


exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || '500';
  err.status = err.status || 'error';

  // if it is in dev env just show the entire error
  if (process.env.NODE_ENV === "development") {
    devError(err, req, res)
  }

  // if it is in prod show the customized error messages
  else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.name = err.name
    error.message = err.message

    // console.log(error)
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) { error = handleDuplicateFieldsDB(error); }
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    // else we just pass it to the prodError function as it is
    prodError(error, req, res)
  }

};