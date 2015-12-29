var mongoose = require('mongoose');

var dataSchema = mongoose.Schema({
 user: {type: Number, ref: 'User'},
 emotion: Number,
 hydrate: Boolean,
 note: String, 
 date: Date
});

var Data = mongoose.model('Data', dataSchema);


module.exports = Data;