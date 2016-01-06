var db = require('./db/database');
var Data = require('./db/models').Data;
var User = require('./db/models').User;

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

  var parsed = parseMessage(twilioBody.Body);
  var accountActions = ["stop", "restart", "delete"];

  // If trying to "stop"/"restart" texts or "delete" account
  // if (accountActions.indexOf(twilioBody.Body.replace(/\s*/g,"")) > -1) {
  //   handleAccountAction(twilioBody.From, twilioBody.Body.replace(/\s*/g,""), function(err, user) {
  //     if (err) {
  //       sendMessage(twilioClient, twilioBody.From, twilioNum, JSON.stringify(err));
  //     }
  //     sendMessage(twilioClient, twilioBody.From, twilioNum, "Got it");
  //   });
  // }

  // If the message isn't properly formatted
  if (!Array.isArray(parsed)) {
    sendMessage(twilioClient, twilioBody.From, twilioNum, parsed);
    return callback(parsed, null);
  }

  // Otherwise, write data to DB and send a confirmation text to user
  User.findOne({phone_number: twilioBody.From}, function(err, user) {
    if (err) {
      sendMessage(twilioClient, twilioBody.From, twilioNum, JSON.stringify(err));
      return callback(err, null);
    }
    sendMessage(twilioClient, twilioBody.From, twilioNum, "Got it");
    callback(null, user);
    writeData(user, parsed);
  });

}

exports.sendWorkerTexts = function(twilio, message, callback) {
  var user;
  User.find({}, function(err, docs) {
    if (err) return callback(err, null);
    for (var i = 0; i < docs.length; i++) {
      user = docs[i];
      sendMessage(twilio.client, user.phone_number, twilio.num, message);
    }
    callback(null, docs);
  });
}

var writeData = function(user, messages) {
  // Write to DB
  var newData = {
    emotion: parseInt(messages[0]),
    hydrate: messages[1],
    note: messages[2],
    date: new Date()
  };

  user.children.push(newData);

  user.save(function(err) {
    if (err) return console.error(err);
    console.log("Success!");
  });
}

exports.findOrCreateUser = function (profile, callback) {
  findUser(profile, function(exists) {
    if (exists) return callback(null, exists);

    var options = {
      googleid: profile.id, 
      name: profile.displayName,
      phone_number: "+1" + profile.phone_number
    };

    var newUser = new User(options);

    newUser.save(function(err) {
      if (err) return callback(err, null);
      callback(null, newUser);
    });
    
  });

}

var parseMessage = function(text) {

  // clean up response text
  var messages = text.split(",");
  var booleans = ['yes','no'];
  var boolString;

  // error handling: not long enough + first arg is not a number
  if (messages.length < 3) return "Invalid format: Not enough arguments";
  if (isNaN(parseInt(messages[0]))) return "Invalid format: First argument must be a number";

  messages = [messages[0], messages[1], messages.slice(2, messages.length).join()];

  for (var i = 0; i < messages.length; i++) {
    var word = messages[i];
    messages[i] = word.replace(/\s*/, "");
  }

  // error handling: second argument isn't a yes/no.
  boolString = messages[1].toLowerCase();
  if (booleans.indexOf(boolString) < 0) return "Invalid format: Second arg must be yes or no";

  // only returns an array (messages) if there are no errors
  messages[1] = boolString === 'yes' ? true : false;
  return messages;
};

// retool this method to make it more reusable!
var findUser = function (options, callback) {
  User.findOne({googleid: options.id}, function(err, doc) {
    return doc ? callback(doc) : callback(null);
  })
};

var sendMessage = function (client, recipient, sender, message) {
  client.messages.create({ 
      to: recipient, 
      from: sender, 
      body: message, 
  }, function(err, result) { 
      console.log(result.sid); 
  });
};

// var handleAccountAction = function (phoneNumber, message, callback) {
//   if (message === "stop") {
//     // find user by phone number, then update dailyText field to FALSE
//   } else if (message === "restart") {
//     // find user by phone number, then update dailyText field to TRUE
//   } else {
//     // delete -- User.findOne({phone_number: phoneNumber}).remove().exec()
//   }
// }