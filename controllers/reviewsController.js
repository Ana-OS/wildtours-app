const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const User = mongoose.model('User');
const Tour = mongoose.model('Tour');
const appError = require('../helpers/newError');
const { addTour } = require('./tourController');


exports.createReview = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('name')
    const tour = await Tour.findById(req.params.tour)

    if (!req.user) {
        return next(new appError('please login', 404))
    };

    const newReview = await Review.create({
        description: req.body.description,
        rating: req.body.rating,
        author: req.user.id,
        tour: req.params.id
    });

    res.redirect('back');
};

exports.review = async (req, res, next) => {
    const review = await Review.findOne({ _id: req.params.id })

    if (!review) {
        return next(new appError('error', 500))
    }
    res.json({
        description: review.description,
        rating: review.rating,
        author: review.author,
        tour: review.tour
    })
};

exports.reviews = async (req, res, next) => {
    if (req.params.tour) filter = { tour: req.params.id }
    const reviews = await Review.find({ tour: req.params.id })
    res.json(reviews)
};

exports.updateReview = async (req, res, next) => {
    const review = await Review.findOneAndUpdate({ _id: req.params.id }, req.body)
}