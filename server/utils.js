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

// var parseText = function (user, messageBody, callback) {

//   if (messageBody.length < 3) return callback("Invalid message length", null);

//   // clean up response text
//   var messages = messageBody.split(",");
//   var booleanVal, bool;

//   // error handling: not long enough + first arg is not a number
//   if (messages.length < 3) return callback("Invalid format: Not enough arguments", null);
//   if (isNaN(parseInt(messages[0]))) return callback("Invalid format: First argument must be a number", null);

//   messages = [messages[0], messages[1], messages.slice(2, messages.length).join()];

//   for (var i = 0; i < messages.length; i++) {
//     var word = messages[i];
//     messages[i] = word.replace(/\s*/, "");
//   }

//   // error handling: second argument isn't a yes/no.
//   booleanVal = messages[1].toLowerCase(); 
//   if (booleanVal !== 'yes' || booleanVal !== 'no') return callback("Invalid format: Second arg must be yes or no", null);
//   bool = booleanVal === yes ? true : false;

//   //Write to DB
//   var newData = new Data({
//     user: user._id,
//     emotion: parseInt(message[0]),
//     hydrate: bool,
//     note: message[2],
//     date: new Date()
//   });

//   newData.save(function(err, data) {
//     if (err) return callback("Error saving your response to our database. Try in a few hours", null);
//     callback(null, "Successfully recorded your response!");
//   })

// };

var sendMessage = function (client, recipientNum, twilioNum, response) {
  client.messages.create({ 
      to: recipientNum, 
      from: twilioNum, 
      body: response, 
  }, function(err, message) { 
      console.log(message.sid); 
  });
}