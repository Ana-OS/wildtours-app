const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
const { catchErrors } = require('../handlers/errorHandler');
const promisify = require('promisify');
const { options } = require('../routes');
const sendMail = require('./email');


// create function that will create a token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRE })
};

// prompt the login form to the user
exports.login = (req, res) => {
    res.send('this is a login form')
}

// handle the actual login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        console.log('please provide an email and a password')
    }

    // .select allows me to get the password even though it is not accessible in the model
    const user = await User.findOne({ email }).select('password');

    // compare the password in the DB with the one user provided in login
    if (!user || !catchErrors((await user.comparePassword(password, user.password)))) {
        res.send('incorrect email or password');
    }

    // create token if login is successful
    const token = createToken(user._id);
    console.log(token)

    // send the token to the client side
};



// check if user is allowed to the route
exports.protect = async (req, res, next) => {
    let token;

    // get the token from the headers authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        console.log('Please login');
    }
    //verify token. because it will run a callback function after verifying the token we promisify it so we can await the verification of that token
    const decoded = await jwt.verify(token, process.env.SECRET_KEY)
    // console.log(decoded.id)

    // check if user still exists using the id that is in the token's payload
    const currentUser = await User.findOne({ _id: decoded.id })
    // console.log(isUser)


    // check if the user changed password after the token was created
    if (currentUser.hasChangedPassword(decoded.iat)) {
        return console.log('password has been changed')
    };

    //create a user field in the request with all its data so we can use it in the next function
    req.user = currentUser;

    // allow user to the route
    next()
};


// prompt the reset Password form and send email with link with new token to user
exports.forgotPassword = (req, res, next) => {
    res.send('this is a reset form')
};



exports.forgotPassword = async (req, res) => {
    // find the user by the email provided
    const user = await User.findOne({ email: req.body.email })
    // console.log(user.email)
    if (!user) {
        console.log('no such email')
    };

    // generate new token calling the instance method on user
    const newToken = user.resetPassword()

    // update the user with the new encrypted token in the DB skipping the validation for the rest of the fields
    await user.save({ validateBeforeSave: false });
    console.log(user)
    // email the link with the new token to the user
    const resetURL = `${req.protocol}://${req.hostname}:${process.env.PORT}/resetToken/${newToken} `;
    console.log(resetURL)

    const message = `click in the link to reset your password.${resetURL} `;
    try {
        await sendMail({
            email: user.email,
            subject: 'reset your password',
            message
        })
    } catch (err) {
        console.log(err)
    }
};


exports.resetPassword = async (req, res) => {
    // check if we have a user in the db with the same token being passed in the the params
    const passedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: passedToken,
        resetPasswordExpires: { $gt: Date.now() }
    })


    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        console.log("you're not a user!!")
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //  login the user
    const token = createToken(user._id);
}


exports.updatePassword = async (req, res) => {
    // 1) Get user from collection
    console.log(req.user)
    const user = await User.findById(req.user.id).select('+password');

    // // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();
    // User.findByIdAndUpdate will NOT work as intended! We need user.save so we can apply all the instance methods to the user

    // // 4) Log user in, send JWT
    // createSendToken(user, 200, res);
}