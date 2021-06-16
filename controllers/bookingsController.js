const mongoose = require('mongoose');
const User = mongoose.model('User');
const Tour = mongoose.model('Tour');
const Booking = mongoose.model('Booking');
const appError = require('../helpers/newError');

exports.book = async (req, res, next) => {
    // const currentUser = req.user
    console.log(req.body)

    const newBooking = await Booking.create({
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        user: req.user,
        tour: req.params.id
    });
    console.log(newBooking)

}