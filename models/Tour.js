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
    difficulty: String,
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
        required: [true, 'A tour must have a price'],
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        // required: [true, 'A tour must have a cover image']
    },
    images: [
        {
            type: String,
            required: [true, 'please upload 4 images']
        }
    ],
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
            coordinates: [Number],
            address: {
                type: String,
                required: 'You must supply an address!'
            },
            place: {
                type: String,
                required: 'please supply a start place!'
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



// tourSchema.post(/^findOneAnd/, async function () {
//     if (this._update.$set.images) {
//         // console.log(this._update.$set.images)
//         const imageCover = this._update.$set.images.shift();
//         this._update.$set.imageCover = imageCover
//         await this.update()
//     }
//     // const imageCover = this._update.$set.images.shift()

//     // this.slug = slugify(this.name, { lower: true });
//     // const imageCover = this.images.shift()
//     // this.imageCover = imagecover
//     // await this.save()
//     // next();
// });

// tourSchema.statics.last4Reviews = function () {
//     return this.aggregate([
//         { $group: { from: 'reviews', localField: '_id', foreignField: 'tour', as: 'reviews' } },
//         { $sort: { createdAt: -1 } },
//         // limit to at most 4
//         { $limit: 4 }
//     ])
// }

// instead of saying that a tour has many reviews we create a virtual attribute of reviews. reviews will be filled by each review that is refrencing THIS tour.id
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});


module.exports = mongoose.model('Tour', tourSchema);