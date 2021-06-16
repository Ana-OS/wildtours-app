
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


reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        // match selecciona todas as reviews cuja tour é a tour passad neste funçao
        {
            $match: { tour: tourId }
        },
        {
            //aqui dizemos como queremos agrupar o reultado do match
            $group: {
                // o id deste grupo (aquilo pelo qual vai ser agrupado será a tour em si)
                _id: '$tour', // agrupamos pelo atributo tour de cada review
                // por cada rating na tour somamos mais um
                numberOfRatings: { $sum: 1 },
                // a calculamos o avg de cada rating
                ratingAverage: { $avg: '$rating' }
            }
        }
    ]);
    //Depois de calcularmos a averago das ratings temos de encontrar a Tour a que a review se refere e fazer o update dos campos ratingAverage e numberOfRatings
    console.log(stats)

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 0
        });
    }
};

reviewSchema.post('save', function () {
    // antes de salvar cada review aplicamos a função calcAverageRatings
    this.constructor.calcAverageRatings(this.tour)
});

// findByIdAndUpdate  
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.review = await this.findOne();
    // console.log(this.r);
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    // await this.findOne(); does NOT work here, query has already executed
    await this.review.constructor.calcAverageRatings(this.review.tour);
});

// reviewSchema.s





module.exports = mongoose.model('Review', reviewSchema);
