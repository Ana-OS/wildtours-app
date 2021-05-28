const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const { catchErrors } = require('../handlers/errorHandler');


router.get('/', catchErrors(tourController.allTours));
router.get('/tours', catchErrors(tourController.allTours));
router.get('/tours/add', tourController.addTour);

router.post('/tours', catchErrors(tourController.createTour));

router.get('/tours/:id', catchErrors(tourController.tour));

router.get('/tours/:id/edit', catchErrors(tourController.editTour));
router.post('/tours/:id', catchErrors(tourController.updateTour));

router.get('/tours/:id/delete', catchErrors(tourController.deleteTour));


module.exports = router;
