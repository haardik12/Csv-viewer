const mongoose = require('mongoose');

const url =
  'mongodb+srv://harrytrap123:iJ6nBnatXQBNFm6c@cluster0.3gne2ol.mongodb.net/CsvDb'

mongoose.connect(url)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Error connecting to MongoDB'))

db.once('open', () => {
  console.log('Connected to Database :: MongoDB ')
})

module.exports = db;

