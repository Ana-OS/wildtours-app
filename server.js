const mongoose = require('mongoose');
const dotenv = require('dotenv');

require('dotenv').config({ path: 'config.env' });

// importing models
require('./models/Tour');
require('./models/User');
require('./models/Review');
require('./models/Booking');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DB_PASS
);


// const start = async () => {
//     try {
//         mongoose.connect(DB, {
//             useNewUrlParser: true,
//             useCreateIndex: true,
//             useUnifiedTopology: true,
//             useFindAndModify: false
//         })
//         console.log("connected")
//     }
//     catch (err) {
//         console.log(err)
//     }


//     const app = require('./app');
//     const port = process.env.PORT || 3001;
//     app.listen(port, () => {
//         console.log(`Express running → PORT ${port}`);
//     });
// };


// start();
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3001;
const app = require('./app');
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
