const mongoose = require('mongoose');
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Please provide a name',
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: 'Please provide a description for this Tour'
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a level of difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    rating: {
        type: Number,

    },
    ratingAverage: {
        type: Number
    },
    numberOfRatings: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: 'please provide a price'
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
        }],
        address: {
            type: String,
            required: 'You must supply an address!'
        }
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date]
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);


// before saving the model slugify the name
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});
// tourSchema.post(/^findByIdAndUpdate/, function (next) {
//     this.slug = slugify(this.name, { lower: true });
//     next();
// });


// instead of saying that a tour has many reviews we create a virtual attribute of reviews. reviews will be filled by each review that is refrencing THIS tour.id
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});


module.exports = mongoose.model('Tour', tourSchema);