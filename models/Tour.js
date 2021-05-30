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
    rating: {
        type: Number,
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
    summary: {
        type: String,
        trim: true,
        // required: [true, 'A tour must have a description']
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
});


// before saving the model slugify the name
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

module.exports = mongoose.model('Tour', tourSchema);