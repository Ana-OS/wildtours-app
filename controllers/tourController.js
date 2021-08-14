const mongoose = require('mongoose');
const Tour = mongoose.model('Tour');
const { body, validationResult, query } = require('express-validator');
const AppError = require('./../helpers/newError');
const multer = require('multer');
const sharp = require('sharp');
// const uuid = require('uuid');

// Tour image
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);


exports.resize = async (req, res, next) => {
    console.log(req.files)
    if (!req.files.imageCover || !req.files.images) return next();
    // Cover Image
    req.body.imageCover = `tour-${req.params.id}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/uploads/${req.body.imageCover}`);

    // images
    req.body.images = [];

    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `tour-${req.params.id}-${i + 1}.jpeg`;

            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/uploads/${filename}`);

            req.body.images.push(filename);
        })
    );
    console.log(req.body)
    next();
};

// show all tours
exports.allTours = async (req, res) => {

    if (Object.keys(req.query).length > 0) {
        let querySearch = { ...req.query }
        const searchableFields = ["name", "price", "difficulty"];

        querySearch = Object.keys(querySearch)
            .filter(key => searchableFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = querySearch[key];
                return obj;
            }, {});

        console.log(querySearch);

        if (Object.keys(querySearch).length === 0) {
            res.send("sorry no results ")
        }
        else {
            const queriedTours = await Tour.find(querySearch);
            res.render('tours', { tours: queriedTours })
            // res.send("poop")
        }

    } else {
        const tours = await Tour.find();
        res.render('tours', { tours })
        // console.log("no query")
    }
};

// number of tours per month
exports.monthlyTours = async (req, res) => {
    const monthlyTours = await Tour.aggregate([
        {    // unwinde the array of startDates
            $unwind: '$startDates'
        },
        {
            $match: {
                rating: { $gte: 4 }
            },
        },
        {
            $group: {
                _id: '$name'
            }
        }
    ]);
    res.send(monthlyTours)
}


// show specific Tour
exports.tour = async (req, res, next) => {
    if (mongoose.isValidObjectId(req.params.id)) {
        const tour = await Tour.findOne({ _id: req.params.id }).populate('reviews');

        res.render('tour', { tour })
        // console.log(tour)

        if (!tour) {
            return next(new AppError('No such tour', 404))

        }
    }





    // // res.render('tour', { tour })
    // if (!tour) {
    //     console.log("poop")
    //     return next(new AppError('No such tour', 400))

    // }
    // res.render('tour', { tour })

    // res.json({ tour })
    // console.log(tour.rating)
};

// add a tour
exports.addTour = (req, res) => {
    res.render('editTour', { title: "Create your tour" })
}

// create a Tour
exports.createTour = async (req, res) => {
    // console.log(req.body);
    const tour = await Tour.create(req.body)
    if (!tour) {
        console.log("poop")
        return next(new AppError('something went wrong creating tour', 400));
    }
    console.log(tour)
    res.redirect('/tours')
}

// render the edit form
exports.editTour = async (req, res) => {
    const tour = await Tour.findOne({ _id: req.params.id });
    res.render('editTour', { title: "edit your tour", tour })
}

// update the tour info
exports.updateTour = async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!tour) {
        return next(new AppError('No document found with that ID', 404));
    }
    console.log(tour)
    // res.redirect(`/tours/${tour._id}`)
}

// delete tour
exports.deleteTour = async (req, res) => {
    const tour = await Tour.findByIdAndDelete({ _id: req.params.id })
    res.redirect('/tours')
}


