const mongoose = require('mongoose');


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Please provide a name',
        unique: true
    },
    description: {
        type: String,
        required: 'Please provide a description for this Tour'
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
            required: 'You must supply coordinates!'
        }],
        address: {
            type: String,
            required: 'You must supply an address!'
        }
    }
});

module.exports = mongoose.model('Tour', tourSchema);