const mongoose = require('mongoose');
// const User = mongoose.model('User');
const Tour = mongoose.model('Tour');
const Booking = mongoose.model('Booking');
const appError = require('../helpers/newError');


exports.bookingForm = async (req, res) => {
    const tour = await Tour.findOne({ _id: req.params.id })
    // console.log(tour)
    res.render('createBooking', { tour })

}


exports.createBooking = async (req, res, next) => {
    if (!req.user) { return next(new appError('please login', 401)) }

    const tour = await Tour.findById(req.params.id)
    let newBooking = { ...req.body }

    if (newBooking.numberOfPeople > tour.maxGroupSize) { return next(new appError('number of reservations exceeds the maximum group limit', 400)) }

    newBooking.user = req.user;
    newBooking.tour = req.params.id;
    const booking = await Booking.create(newBooking);

};

exports.editBookingForm = async (req, res, next) => {
    const toursProjection = {
        name: true,
        imageCover: true,

    };
    const booking = await Booking.findOne({ _id: req.params.id }).populate('tour', toursProjection)
    console.log(booking)
    // res.render('createBooking', { booking })
}


exports.deleteBooking = async (req, res) => {

    const deletedBooking = await Booking.findOneAndDelete({ _id: req.params.id })
    console.log(deletedBooking)
    // res.json({ message: "booking deleted" })
}

exports.booking = async (req, res) => {
    const booking = await Booking.findOne({ _id: req.params.id })
    res.send(booking)
}

exports.userBookings = async (req, res, next) => {
    const toursProjection = {
        name: true,
        imageCover: true
    };

    const allBookings = await Booking.find({ user: req.user }).populate('tour', toursProjection)
    // console.log(allBookings)
    // res.render('myBookings', { allBookings })

}