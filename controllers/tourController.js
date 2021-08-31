const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const Tour = mongoose.model('Tour');
const AppError = require('./../helpers/newError');
const multer = require('multer');
const sharp = require('sharp');

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

exports.resizeImageCover = async (req, res, next) => {
    if (!req.files || !req.files.imageCover) { return next() }

    req.body.imageCover = `tour-${req.params.id}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
        .resize(2600, 1190)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/uploads/${req.body.imageCover}`);
    next();

};

exports.resizeTourImages = async (req, res, next) => {
    if (!req.files || !req.files.images) { return next() }

    let uploadedImages = [];

    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `tour-${req.params.id}-${i + 1}.jpeg`;

            await sharp(file.buffer)
                .resize(500, 500)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/uploads/${filename}`);

            uploadedImages.push(filename);
        })
    );
    req.uploadedImages = uploadedImages.sort()
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
        }

    } else {
        const tours = await Tour.find();
        res.render('tours', { tours })
    }
};

// number of tours per month
exports.monthlyTours = async (req, res) => {
    const monthlyTours = await Tour.aggregate([
        {
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
        const tour = await Tour.findOne({ _id: req.params.id }).populate({
            path: 'reviews', options: {
                limit: 2, sort: { createdAt: -1 },
            }
        })

        if (!tour) {
            return next(new AppError('No such tour', 404))
        }
        res.render('tour', { tour })
    }
};

// add a tour
exports.addTour = (req, res) => {
    res.render('createTour', { title: "Create your tour" })
}

// create a Tour
exports.createTour = async (req, res) => {
    const tour = await Tour.create(req.body)
    if (!tour) {
        console.log("poop")
        return next(new AppError('something went wrong creating tour', 400));
    }
    res.redirect('/tours')
}

// render the edit form
exports.editTour = async (req, res) => {
    const tour = await Tour.findOne({ _id: req.params.id });
    res.render('editTour', { title: "edit your tour", tour })
}

// update the tour info
exports.updateTour = async (req, res, next) => {
    const today = new Date()
    const startDate = new Date(req.body.startDate)

    const tourPromise = await Tour.findById(req.params.id)
    if (req.body.startDate > req.body.endDate) {
        return next(new AppError('Your tour end date can\'t be before the start date', 300));
    }
    else if (startDate < today) {
        return next(new AppError('The tour can\'t start in the past', 300))
    }

    if (req.uploadedImages) {
        for (let i = 0; i < req.uploadedImages.length; i++) { tourPromise.images[i] = req.uploadedImages[i] }
    }

    req.body.images = tourPromise.images
    req.body.author = req.user
    const tour = await Tour.findByIdAndUpdate({ _id: tourPromise._id }, req.body, {
        new: true,
        runValidators: true
    }).exec();
    res.render('tour', { tour })
}

// delete tour
exports.deleteTour = async (req, res) => {
    const tour = await Tour.findOneAndDelete({ _id: req.params.id })
    res.redirect('/tours')
}
