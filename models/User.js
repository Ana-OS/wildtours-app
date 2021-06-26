const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Please provide a name',
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid Email Address']
    },
    photo: String,
    password: {
        type: String,
        required: 'please provide a password',
        minlength: 6,
        // select: false prevents the password to show in an output
        // select: false
    },
    confirmPassword: {
        type: String,
        required: 'please confirm your password',
        select: false,
        validates: {
            // only works on save or create
            validator: function (el) {
                return el === this.password
            },
            message: 'Passwords are not the same'
        }
    },
    changedPasswordAt: {
        type: Date
    },
    passwordResetToken: String,
    resetPasswordExpires: Date
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


// comparePasswords is an instance method that can be called on the userSchema model. bcrypt.compares is provided by bcrypt

userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
    { return await bcrypt.compare(candidatePassword, userPassword) };
};


userSchema.methods.hasChangedPassword = function (JWTTimestamps) {
    if (this.passwordChangedAt) {
        // JWTT is in seconds somwe need
        // since passwordChangedAt is a date we need to get it in miliseconds with getTime(); parseInt to have it as an integer. Because the tokenTimestamp is in seconds we do miliseconds /1000 so we can have both in seconds
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        // se o timstamp em que o token foi criado for menor que a data em que o user alterou a password então retorna true = o token for criado apenas depois da pass ter sido alterada portanto tudo ok
        return JWTTimestamp < changedTimestamp;
    };
};

userSchema.methods.resetPassword = function () {
    // create the token that will be sent to the user
    const newToken = crypto.randomBytes(32).toString('hex');

    // encrypt that new token for safety reasons and save it to the DB  (we'll later compare both)
    this.passwordResetToken = crypto.createHash('sha256').update(newToken).digest('hex');
    // save to the DB the date when we created the new token plus a few seconds more so we can have the time to await on the result where we call this instance method
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    return newToken;
}

module.exports = mongoose.model('User', userSchema);