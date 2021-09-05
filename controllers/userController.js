const mongoose = require('mongoose');
const Booking = mongoose.model('Booking');
const Tour = mongoose.model('Tour');
const { catchErrors } = require('../handlers/errorHandler');

// prompt the registrations form
exports.register = (req, res) => {
    res.render("register")
};

// prompt the login form to the user
exports.login = (req, res) => {
    res.render('login')
};

// prompt the reset Password form and send email with link with new token to user
exports.forgotPassword = (req, res, next) => {
    res.send('this is a reset form')
};

exports.updateProfile = async (req, res, next) => {
    res.render('account')
}

exports.myTours = async (req, res, next) => {
    const tours = await Tour.find({ author: req.user._id })
    res.render('myTours', { tours })
}

