
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Tour = mongoose.model('Tour');

const reviewSchema = new mongoose.Schema({
    description: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        masx: 5,
        required: 'Please rate this Tour'
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour'
    }
});




module.exports = mongoose.model('Review', reviewSchema);
