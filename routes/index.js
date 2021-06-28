const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewsController = require('../controllers/reviewsController');
const bookingsController = require('../controllers/bookingsController');
const { catchErrors } = require('../handlers/errorHandler');


router.use(authController.isLoggedIn)


//////     Tour Routes     //////

//  get all tours
router.get('/', catchErrors(tourController.allTours));
router.get('/tours', catchErrors(authController.protect), catchErrors(tourController.allTours));
router.get('/tours/monthly', catchErrors(tourController.monthlyTours));
// create a tour
router.get('/tours/add', tourController.addTour);
router.post('/tours', catchErrors(authController.protect), catchErrors(tourController.createTour))
// get a specific tour
router.get('/tours/:id', catchErrors(tourController.tour));
// update tour
router.get('/tours/:id/edit', catchErrors(tourController.editTour));
router.post('/tours/:id', catchErrors(tourController.updateTour));
// delete tour
router.get('/tours/:id/delete', catchErrors(tourController.deleteTour));


//////     Booking Routes     //////

// get booking
router.get('/tours/:id/book', catchErrors(authController.protect), catchErrors(bookingsController.createBooking));

// create booking
router.post('/tours/:id/book', catchErrors(bookingsController.createBooking));

// get all User Bookings
router.get('/myBookings', catchErrors(userController.userBookings));
//////     User Routes     //////

// create 
router.get('/register', userController.register);
router.post('/register', authController.upload,
    catchErrors(authController.resize), catchErrors(authController.createUser));
// login
router.get('/login', userController.login);
router.post('/login', catchErrors(authController.loginUser));

// update user
router.get('/account', userController.updateProfile)
router.post('/updateProfile', authController.upload,
    catchErrors(authController.resize), catchErrors(authController.updateProfile));

// logout
router.get('/logout', authController.logout)

// forgotPassword send an email to the user with the link to reset the token
router.post('/forgotpassword', catchErrors(authController.forgotPassword));
router.patch('/resetToken/:token', catchErrors(authController.resetPassword));
router.patch('/updatePassword', catchErrors(authController.protect), catchErrors(authController.updatePassword));




//////     Review Routes     //////

// get all reviews
router.get('/tours/:id/reviews', catchErrors(reviewsController.reviews));
// getting one review
router.get('/reviews/:id', catchErrors(reviewsController.review));

//Update Review
router.patch('/reviews/:id', catchErrors(reviewsController.updateReview));

// create Review
router.get('/tours/:id/addReview', catchErrors(authController.protect), catchErrors(reviewsController.addReview));
router.post('/tours/:id/addReview', catchErrors(authController.protect), catchErrors(reviewsController.createReview));


module.exports = router;
