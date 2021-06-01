const mongoose = require('mongoose');
const User = mongoose.model('User');
// const { body, validationResult } = require('express-validator');


exports.register = (req, res) => {
    console.log('xixi')
};


exports.createUser = async (req, res) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });
    console.log(user)
}