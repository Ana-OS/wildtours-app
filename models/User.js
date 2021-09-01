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
    photo: {
        type: String,
        default: 'default.jpg'
    },
    password: {
        type: String,
        required: 'please provide a password',
        minlength: 6,
    },
    confirmPassword: {
        type: String,
        required: 'please confirm your password',
        select: false,
        validates: {
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
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
    { return await bcrypt.compare(candidatePassword, userPassword) };
};


userSchema.methods.hasChangedPassword = function (JWTTimestamps) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    };
};

userSchema.methods.resetPassword = function () {
    // create the token that will be sent to the user
    const newToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(newToken).digest('hex');
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    return newToken;
};

userSchema.virtual('bookings', {
    ref: 'Booking',
    foreignField: 'user',
    localField: '_id'
});

module.exports = mongoose.model('User', userSchema);