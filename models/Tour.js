const mongoose = require('mongoose');
const slugify = require('slugify')
const AppError = require('./../helpers/newError');


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters']
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
        type: Number,
        // required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        // required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        // required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        // required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    startLocation: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number],
        address: {
            type: String,
            required: 'You must supply an address!'
        },
        place: {
            type: String,
            required: 'please supply a start place!'
        },
        day: {
            type: String,
            default: "Start Tour"
        }
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                // required: 'You must supply coordinates'
            },
            place: {
                type: String,
                // required: 'Please provide the location name'
            },
            day: Number
        }
    ],
    endLocation: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number],
        address: {
            type: String,
            required: 'You must supply an address!'
        },
        place: {
            type: String,
            required: 'please supply a start place!'
        },
        day: {
            type: String,
            default: "End Tour"
        }
    },
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);


// before saving the model slugify the name
tourSchema.pre('save', function (next) {
    // if (!this.isModified(name)) {
    //     return next();
    // }
    this.slug = slugify(this.name, { lower: true });
    // if (!this.coordinates) {
    //     return next(new AppError('please provide a valid address', 400));
    // }
    next();
});

tourSchema.post(/^findByIdAndUpdate/, function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});


// instead of saying that a tour has many reviews we create a virtual attribute of reviews. reviews will be filled by each review that is refrencing THIS tour.id
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

module.exports = mongoose.model('Tour', tourSchema);