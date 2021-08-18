const mongoose = require('mongoose');
const Tour = mongoose.model('Tour');

const reviewSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: 'Please leave a comment about this tour'
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
    console.log({ stats })


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
    // antes de salvar cada review aplicamos a função calcAverageRatings
    this.constructor.calcAverageRatings(this.tour)

});

// findByIdAndUpdate  
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.review = await this.findOne();
    console.log(this.review);
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    // await this.findOne(); does NOT work here, query has already executed
    await this.review.constructor.calcAverageRatings(this.review.tour);
});



module.exports = mongoose.model('Review', reviewSchema);
