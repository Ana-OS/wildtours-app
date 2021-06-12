const mongoose = require('mongoose');
const dotenv = require('dotenv');

require('dotenv').config({ path: 'config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DB_PASS
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => { console.log("connected") });


require('./models/Tour');
require('./models/User');
require('./models/Review');

const app = require('./app');
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Express running → PORT ${port}`);
});