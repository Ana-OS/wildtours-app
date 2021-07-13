const AppError = require('../helpers/newError');

exports.catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};


const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
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

  if (err.isOperational) {
    console.log(err.name);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }


  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'please try again later'
  });
};





exports.globalErrorHandler = (err, req, res, next) => {
  // console.log(`I'm the golbal ErrorHandler ${err.stack}`)

  err.statusCode = err.statusCode || '500';
  err.status = err.status || 'error';


  // if it is in dev env just show the entire error
  if (process.env.NODE_ENV === "development") {
    devError(err, req, res)
  }

  // if it is in prod show the customized error messages
  else if (process.env.NODE_ENV === "production") {
    // destructure the err and assign to error so we can define new messages and new status
    let error = { ...err };
    error.name = err.name
    error.message = err.message


    // if the error has certain names or code we treat it differently
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();



    // else we just pass it to the prodError function as it is
    prodError(error, req, res)
  }

};