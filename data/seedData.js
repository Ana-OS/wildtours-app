const fs = require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../models/Tour');

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

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/toursSeed.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
      await Tour.create(tours);
      console.log('Data successfully loaded!');
      process.exit();
  } catch (err) {
      console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
      await Tour.deleteMany();
      console.log('Data successfully deleted!');
      process.exit();
  } catch (err) {
      console.log(err);
  }
  process.exit();
};


console.log(process.argv)

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
