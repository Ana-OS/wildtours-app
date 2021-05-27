const mongoose = require('mongoose');
const Tour = mongoose.model('Tour');
const { body, validationResult } = require('express-validator');


// show all tours
exports.allTours = async (req, res) => {
    const tours = await Tour.find();
    res.render('layout', { tours })
    // console.log(tours)
};

// show specific Tour
exports.tour = async (req, res) => {
    const tour = await Tour.findOne({ _id: req.params.id });
    res.render('tour', { tour })
};

// add a tour
exports.addTour = (req, res) => {
    res.render('editTour', { title: "Create your tour" })
}

// create a Tour
exports.createTour = async (req, res) => {
    // console.log(req.body);
    const tour = await (new Tour(req.body)).save();
    // console.log(tour)
    res.redirect(`/tours/${tour._id}`)
}

// render the edit form
exports.editTour = async (req, res) => {
    const tour = await Tour.findOne({ _id: req.params.id });
    res.render('editTour', { title: "edit your tour", tour })
}

// update the tour info
exports.updateTour = async (req, res) => {
    const tour = await Tour.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });
    res.redirect(`/tours/${tour._id}`)
}

// delete tour
exports.deleteTour = async (req, res) => {
    const tour = await Tour.findByIdAndDelete({ _id: req.params.id })
    res.redirect('/tours')
}