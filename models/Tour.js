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
        default: 4.5
    },
    price: {
        type: Number,
        required: 'please provide a price'
    }
});

module.exports = mongoose.model('Tour', tourSchema);