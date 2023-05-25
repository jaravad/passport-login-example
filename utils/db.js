const mongoose = require('mongoose');

const databaseConnection = mongoose.connect(process.env.DB_URI);

module.exports = { databaseConnection };