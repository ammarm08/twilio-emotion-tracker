var twilio = require('twilio');

var accountSid = process.env.TWILIO_SID || require('../config.js').twilio.account;
var authToken = process.env.TWILIO_AUTH || require('../config.js').twilio.token;
var twilioNum = process.env.NUM || require('../config.js').twilio.number;

exports.client = twilio(accountSid, authToken);
exports.handler = twilio;
exports.authToken = authToken;
exports.num = twilioNum;