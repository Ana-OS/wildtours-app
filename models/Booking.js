const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
  },
  Middle: String,
  lastName: {
    type: String,
    required: [true, 'Please provide your last name'],
  },
  phoneNumber:  {
    type: Number,
    required: [true, 'Please provide your phone number'],
  },
  totalAmount: Number,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour'
  }
});


module.exports = mongoose.model('Booking', bookingSchema);
