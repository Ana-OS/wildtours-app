const mongoose = require('mongoose');
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters']
    },
    slug: String,
    duration: {
        type: Number,
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: [String],
      required: [true, 'Please select a difficulty level']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10
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
        required: [true, 'Please upload one image cover'],
    },
    images: [
        {
          type: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDate: Date,
    endDate: Date,
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
            },
            place: {
                type: String,
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
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


// before saving the model slugify the name
// tourSchema.pre('save', function (next) {
//     this.slug = slugify(this.name, { lower: true });
//     next();
// });


tourSchema.virtual('bookings', {
    ref: 'Booking',
    foreignField: 'tour',
    localField: '_id',
    count: true
})

tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',

});


module.exports = mongoose.model('Tour', tourSchema);
