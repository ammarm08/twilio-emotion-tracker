var db = require('./db/database');
var User = require('./db/userModel');
var Data = require('./db/dataModel');

exports.checkUser = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

exports.checkUserRegistry = function (req, res, next) {
  // if # found, next()
  var id = req.user.id || null;
  User.findOne({googleid: id}, function(err, user) {
    if (!user || !user.phone_number) {
      res.redirect('/complete');
    } else {
      next();
    }
  });
};

exports.handleTextMessage = function(twilioBody, twilioClient, twilioNum, callback) {

  // check if user exists, if not, text back telling user to sign up on website first.
  User.findOne({phone_number: twilioBody.From.slice(2)}, function(err, user) {
    if (!user || err) {
      var notFound = "No user found. Create an account at regulate.herokuapp.com!";
      sendMessage(twilioClient, twilioBody.From, twilioNum, notFound);
      callback(notFound, null);
    } else {
      var found = "Found!";
      sendMessage(twilioClient, twilioBody.From, twilioNum, found);
      callback(null, found);
      // parseText(user, twilioBody.Body, function(err, message) {
      //   if (err) {
      //     sendMessage(twilioClient, twilioBody.From, twilioNum, err);
      //     return callback(err, null);
      //   } else {
      //     sendMessage(twilioClient, twilioBody.From, twilioNum, message);
      //     return callback(null, message);
      //   }
      // }
    }
  });

}

exports.parseMessage = function(text) {

  // clean up response text
  var messages = text.split(",");
  var booleans = ['yes','no'];

  // error handling: not long enough + first arg is not a number
  if (messages.length < 3) return "Invalid format: Not enough arguments";
  if (isNaN(parseInt(messages[0]))) return "Invalid format: First argument must be a number";

  messages = [messages[0], messages[1], messages.slice(2, messages.length).join()];

  for (var i = 0; i < messages.length; i++) {
    var word = messages[i];
    messages[i] = word.replace(/\s*/, "");
  }

  // error handling: second argument isn't a yes/no.
  if (booleans.indexOf(messages[1].toLowerCase()) < 0) return "Invalid format: Second arg must be yes or no";

  // only returns an array (messages) if there are no errors
  return messages;
}

exports.writeData = function(user, messages, callback) {

  if (!Array.isArray(messages)) {
    return callback("Not a valid message", null);
  }

  // Write to DB
  var newData = new Data({
    user: user._id,
    emotion: parseInt(messages[0]),
    hydrate: messages[1],
    note: messages[2],
    date: new Date()
  });

  newData.save(function(err) {
    if (err) return callback(err, null);
    callback(null, newData);
  });

}

exports.findOrCreateUser = function (profile, callback) {
  findUser(profile, function(exists) {
    if (exists) return callback(null, exists);

    var options = {
      googleid: profile.id, 
      name: profile.displayName,
      phone_number: profile.phone_number
    };

    var newUser = new User(options);

    newUser.save(function(err) {
      if (err) return callback(err, null);
      callback(null, newUser);
    });
    
  });

}

var findUser = function (options, callback) {
  User.findOne({googleid: options.id}, function(err, doc) {
    return doc ? callback(doc) : callback(null);
  })
};

var sendMessage = function (client, recipientNum, twilioNum, response) {
  client.messages.create({ 
      to: recipientNum, 
      from: twilioNum, 
      body: response, 
  }, function(err, message) { 
      console.log(message.sid); 
  });
}