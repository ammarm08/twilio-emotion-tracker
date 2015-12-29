var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
 googleid: Number,
 name: String,
 phone_number: String
});

var User = mongoose.model('User', userSchema);


module.exports = User;