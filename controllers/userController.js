const mongoose = require('mongoose');
const Tour = mongoose.model('User');
const { body, validationResult } = require('express-validator');