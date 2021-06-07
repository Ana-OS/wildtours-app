const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandler');


router.get('/', catchErrors(tourController.allTours));
router.get('/tours', catchErrors(authController.protect), catchErrors(tourController.allTours));
router.get('/tours/add', tourController.addTour);

// monthly tours
router.get('/tours/monthly', catchErrors(tourController.monthlyTours));
router.post('/tours', catchErrors(tourController.createTour))
router.get('/tours/:id', catchErrors(tourController.tour));
router.get('/tours/:id/edit', catchErrors(tourController.editTour));
router.post('/tours/:id', catchErrors(tourController.updateTour));

router.get('/tours/:id/delete', catchErrors(tourController.deleteTour));



// user routes

router.get('/register', userController.register);
router.post('/register', catchErrors(userController.createUser));

router.get('/login', authController.login);
router.post('/login', catchErrors(authController.loginUser));


// forgotPassword send an email to the user with the link to reset the token
router.post('/forgotpassword', catchErrors(authController.forgotPassword));

// the link resets the token
router.patch('/resetToken/:token', catchErrors(authController.resetPassword));

router.patch('/updatePassword', catchErrors(authController.protect), catchErrors(authController.updatePassword));


module.exports = router;
