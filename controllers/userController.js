const mongoose = require('mongoose');
const User = mongoose.model('User');
var jwt = require('jsonwebtoken');
const { catchErrors } = require('../handlers/errorHandler');

// const { body, validationResult } = require('express-validator');

// create function that will create a token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRE })
};


// prompt the registrations form
exports.register = (req, res) => {
    res.send("poop")
};

// prompt the login form to the user
exports.login = (req, res) => {
    res.send('this is a login form')
};


// prompt the reset Password form and send email with link with new token to user
exports.forgotPassword = (req, res, next) => {
    res.send('this is a reset form')
};
