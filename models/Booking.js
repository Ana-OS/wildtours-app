const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Booking', bookingSchema);
