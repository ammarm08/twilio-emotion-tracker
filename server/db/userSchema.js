var mongoose = require('mongoose');
var dataSchema = require('./dataSchema');

var userSchema = mongoose.Schema({
 googleid: Number,
 name: String,
 phone_number: String,
 daily_text: { type: Boolean, default: true },
 children: [dataSchema]
});


module.exports = userSchema;