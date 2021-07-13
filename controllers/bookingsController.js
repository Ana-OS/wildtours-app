const mongoose = require('mongoose');
const User = mongoose.model('User');
const Tour = mongoose.model('Tour');
const Booking = mongoose.model('Booking');
const appError = require('../helpers/newError');


exports.bookingForm = (req, res) => {
    const tour = Tour.findOne({ id: req.params.id })
    res.render('createBooking', { tour })
}


exports.createBooking = async (req, res, next) => {
    if (!req.user) {
        return next(new appError('please login', 401))
    }
    const newBooking = await Booking.create({
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        user: req.user,
        tour: req.params.id
    });

    console.log({ newBooking })

};


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

    res.render('myBookings', { allBookings })

}