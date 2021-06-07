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


// create the user
exports.createUser = async (req, res) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        changedPasswordAt: req.body.changedPasswordAt
    });

    // console.log(user)
    const token = createToken(user._id);
};



