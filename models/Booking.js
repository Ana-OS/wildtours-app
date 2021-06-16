const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    startDate: {
        type: Date,
        required: 'please provide a start date'
    },
    endDate: {
        type: Date,
        required: 'please provide an end date'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour'
    }

});

module.exports = mongoose.model('Booking', bookingSchema);
