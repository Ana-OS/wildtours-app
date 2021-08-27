const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    // startDate: {
    //     type: Date,
    //     required: 'please provide a start date'
    // },
    firstName: String,
    Middle: String,
    LastName: String,
    phoneNumber: Number,
    emergencyNumber: Number,
    totalAmount: Number,
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
