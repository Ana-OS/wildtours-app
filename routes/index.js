const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewsController = require('../controllers/reviewsController');
const bookingsController = require('../controllers/bookingsController');
const { catchErrors } = require('../handlers/errorHandler');

router.use(authController.isLoggedIn)

router.get('/', catchErrors(tourController.allTours));
router.get('/tours', catchErrors(tourController.allTours));
// router.use(authController.protect)

// monthly tours
router.get('/tours/add', tourController.addTour);

router.get('/tours/monthly', catchErrors(tourController.monthlyTours));
router.post('/tours', catchErrors(authController.protect), catchErrors(tourController.createTour))
router.get('/tours/:id', catchErrors(tourController.tour));
router.get('/tours/:id/edit', catchErrors(tourController.editTour));

// Book a tour
router.get('/tours/:id/book', catchErrors(authController.protect), catchErrors(bookingsController.book));
router.post('/tours/:id', catchErrors(tourController.updateTour));
router.get('/tours/:id/delete', catchErrors(tourController.deleteTour));


// user routes

router.get('/register', userController.register);
router.post('/register', catchErrors(authController.createUser));

router.get('/login', userController.login);
router.post('/login', catchErrors(authController.loginUser));

router.get('/logout', authController.logout)

// forgotPassword send an email to the user with the link to reset the token
router.post('/forgotpassword', catchErrors(authController.forgotPassword));

// the link resets the token
router.patch('/resetToken/:token', catchErrors(authController.resetPassword));
router.patch('/updatePassword', catchErrors(authController.protect), catchErrors(authController.updatePassword));
router.patch('/updateProfile', catchErrors(authController.protect), catchErrors(authController.updateProfile));


// Reviews routes

// creating review
router.get('/tours/:id/addReview', catchErrors(authController.protect), catchErrors(reviewsController.addReview));
router.post('/tours/:id/addReview', catchErrors(authController.protect), catchErrors(reviewsController.createReview));


// getting one review
router.get('/reviews/:id', catchErrors(reviewsController.review));
router.patch('/reviews/:id', catchErrors(reviewsController.updateReview));

// get all reviews
router.get('/tours/:id/reviews', catchErrors(reviewsController.reviews));

module.exports = router;
