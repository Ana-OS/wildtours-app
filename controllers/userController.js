const mongoose = require('mongoose');
const User = mongoose.model('User');
const Tour = mongoose.model('Tour');
const jwt = require('jsonwebtoken');
const { catchErrors } = require('../handlers/errorHandler');
const appError = require('../helpers/newError');


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
    console.log(tours)
    res.render('myTours', { tours })

}

// const reviews = await Review.find({ tour: req.params.id })