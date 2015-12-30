var mongoose = require('mongoose');

var dataSchema = mongoose.Schema({
 emotion: Number,
 hydrate: Boolean,
 note: String, 
 date: Date
});

module.exports = dataSchema;