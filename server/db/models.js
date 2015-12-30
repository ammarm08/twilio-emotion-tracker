var mongoose = require('mongoose');
var dataSchema = require('./dataSchema');
var userSchema = require('./userSchema');

exports.Data = mongoose.model('Data', dataSchema);
exports.User = mongoose.model('User', userSchema);