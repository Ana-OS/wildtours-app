const mongoose = require('mongoose');
const Tour = mongoose.model('Tour');

const reviewSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: 'Please leave a comment about this tour',

        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
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
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

function autopopulate(next) {
    this.populate('author');
    next();
}

reviewSchema.pre('find', autopopulate);
reviewSchema.pre('findOne', autopopulate);


reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                numberOfRatings: { $sum: 1 },
                ratingAverage: { $avg: '$rating' }
            }
        }
    ]);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            numberOfRatings: stats[0].numberOfRatings,
            ratingAverage: stats[0].ratingAverage
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            numberOfRatings: 0,
            ratingAverage: 0
        });
    }
};

reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.tour)

});

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.review = await this.findOne();
    console.log(this.review);
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    await this.review.constructor.calcAverageRatings(this.review.tour);
});



module.exports = mongoose.model('Review', reviewSchema);
