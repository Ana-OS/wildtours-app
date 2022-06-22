const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
const sendMail = require('../helpers/email');
const AppError = require('../helpers/newError');
const multer = require('multer');
const sharp = require('sharp');
const uuid = require('uuid');

// create function that will create a token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRE });
};

const sendToken = (user, res) => {
  const token = createToken(user._id);
  const cookieOptions = {
    expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  // Remove password from output
  user.password = undefined;
  res.send({
    status: 'success',
    token,
    data: {
      user
    }
  });
};


const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
  }
});

exports.upload = upload.single('photo');

exports.resize = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `${uuid.v4()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/uploads/${req.file.filename}`);

  next();
};


// create the user for the first time
exports.createUser = async (req, res, next) => {
  let newUser = { ...req.body }
  if (req.file) { newUser.photo = req.file.filename }
  else { newUser.photo = "default.jpg" }
  const user = await User.create(newUser);
  req.user = user;
  res.locals.user = user;
  sendToken(user, res)

};


// handle the actual login
exports.loginUser = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return next(new AppError('please provide an email and a password', 404))
  }

  const user = await User.findOne({ email }).select('+password');
  // compare the password in the DB with the one user provided in login

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('incorrect email or password. Please review your access info', 404))
  }
  req.user = user;
  res.locals.user = user;

  // send the token to the client side
  sendToken(user, res)
};



// check if user is allowed to the route
exports.protect = async (req, res, next) => {
  let token;

  // get the token from the headers authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
      // or from the cookies
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.send('Please login');
  }
  //verify token. because
  const decoded = await jwt.verify(token, process.env.SECRET_KEY)

  // use the id in the token payload to check if user still exists using the id that is in the token's payload
  const currentUser = await User.findById(decoded.id)

  // check if the user changed password after the token was created using the iat in the token
  if (currentUser.hasChangedPassword(decoded.iat)) {
    return res.send('password has been changed')
  };

  //create a user field in the request with all its data
  req.user = currentUser;
  res.locals.user = currentUser;
  // allow user to the next route
  next()
};


// exports.forgotPassword = async (req, res, next) => {
//     // find the user by the email provided
//     const user = await User.findOne({ email: req.body.email })

//     if (!user) {
//       return next(new AppError('the email you provided is not registered', 404))
//     };

//     // generate new token calling the instance method on user
//     const newToken = user.resetPassword()

//     // update the user with the new encrypted token in the DB skipping the validation for the rest of the fields
//     await user.save({ validateBeforeSave: false });
//     // email the link with the new token to the user
//     const resetURL = `${req.protocol}://${req.hostname}:${process.env.PORT}/resetToken/${newToken} `;
//     const message = `click in the link to reset your password.${resetURL} `;
//     try {
//       await sendMail({
//           email: user.email,
//           subject: 'reset your password',
//           message
//       })
//     } catch (err) {
//       console.log(err)
//     }
// };


exports.resetPassword = async (req, res) => {
    // check if we have a user in the db with the same token being passed in the the params
    const passedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: passedToken,
        resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
        return next(new appError('user not found', 404))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    //  login the user
    const token = createToken(user._id);
};

exports.updateProfile = async (req, res) => {
    let updateBody = {
      name: req.body.name,
      email: req.body.email,
    }
    if (req.file) { updateBody.photo = req.file.filename }
    else { newUser.photo = "default.jpg" }

    //  3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id,
      updateBody, {
      new: true,
      runValidators: false
    }).exec();
    //  4) Log user in, send JWT
    sendToken(updatedUser, res);
};


// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await (jwt.verify)(
        req.cookies.jwt,
        process.env.SECRET_KEY
      );
      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      // console.log({ currentUser })

      if (!currentUser) { return next(); }

      // 3) Check if user changed password after the token was issued
      if (currentUser.hasChangedPassword(decoded.iat)) {
        return next();
      }
      req.user = currentUser;
      res.locals.user = currentUser;

      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};
