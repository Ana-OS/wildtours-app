const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Please provide a name',
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid Email Address']
    },
    photo: String,
    password: {
        type: String,
        required: 'please provide a password',
        minlength: 6
    },
    confirmPassword: {
        type: String,
        required: 'please confirm your password',
        validates: {
            // only works on save or create
            validator: function (el) {
                return el === this.password
            },
            message: 'Passwords are not the same'
        }
    }
});

userSchema.pre('save', async function (next) {
    // isMofified comes from Mongo db
    if (!this.isModified('password')) return next();

    // if password is indeed modified or created for the first time then hash it
    this.password = await bcrypt.hash(this.password, 12)
    // and because this is all made pre saving user we save the confirmed password back to undefined. confirmPassword is required as an input but not to be persisting db
    this.confirmPassword = undefined;
    next();
});


module.exports = mongoose.model('User', userSchema);