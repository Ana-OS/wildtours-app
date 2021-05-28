const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Please provide a name',
        unique: true
    },
    email: {
        type: String,
        required: 'Please provide a description for this Tour'
    }
});

module.exports = mongoose.model('User', userSchema);