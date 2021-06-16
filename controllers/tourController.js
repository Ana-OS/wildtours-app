const mongoose = require('mongoose');
const Tour = mongoose.model('Tour');
const { body, validationResult, query } = require('express-validator');


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
            res.render('layout', { tours: queriedTours })
            // res.send("poop")
        }

    } else {
        const tours = await Tour.find();
        res.render('layout', { tours })
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
exports.tour = async (req, res) => {
    const tour = await Tour.findOne({ _id: req.params.id }).populate('reviews');
    // res.render('tour', { tour })
    res.json({ tour })
};

// add a tour
exports.addTour = (req, res) => {
    res.render('editTour', { title: "Create your tour" })
}

// create a Tour
exports.createTour = async (req, res) => {
    console.log(req.body);
    const tour = await (new Tour(req.body)).save();
    console.log(tour)
    // res.redirect(`/tours/${tour._id}`)
}

// render the edit form
exports.editTour = async (req, res) => {
    const tour = await Tour.findOne({ _id: req.params.id });
    res.render('editTour', { title: "edit your tour", tour })
}

// update the tour info
exports.updateTour = async (req, res) => {
    const tour = await Tour.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });
    console.log(tour)
    res.redirect(`/tours/${tour._id}`)
}

// delete tour
exports.deleteTour = async (req, res) => {
    const tour = await Tour.findByIdAndDelete({ _id: req.params.id })
    res.redirect('/tours')
}


