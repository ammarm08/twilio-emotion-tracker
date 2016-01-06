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

  var parsed = exports.parseMessage(twilioBody.Body);

  // If trying to "stop"/"restart" texts or "delete" account
  if (exports.validAccountAction(twilioBody.Body)) {
    handleAccountAction(twilioBody.From, twilioBody.Body, function(err, user) {
      if (err) {
        sendMessage(twilioClient, twilioBody.From, twilioNum, JSON.stringify(err));
        return callback(err, null);
      }
      sendMessage(twilioClient, twilioBody.From, twilioNum, "Got it");
      return callback(null, user);
    });
  // If the message isn't properly formatted
  } else if (!Array.isArray(parsed)) {

    sendMessage(twilioClient, twilioBody.From, twilioNum, parsed);
    return callback(parsed, null);

  // Otherwise, write data to DB and send a confirmation text to user
  } else {

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

}

exports.parseMessage = function(text) {

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

// for test case use only (approximating handleAccountActions)
exports.validAccountAction = function(text) {

  var accountActions = ["remove", "restart", "delete"];
  text = text.toLowerCase();

  if (accountActions.indexOf(text.replace(/\s*/g,"")) > -1) {
    return true;
  } else {
    return false;
  }
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
};

var handleAccountAction = function (phoneNumber, message, callback) {

  message = message.replace(/\s*/g,"");
  message = message.toLowerCase();

  User.findOne({phone_number: phoneNumber}, function(err, user) {
    if (err) {
      sendMessage(twilioClient, twilioBody.From, twilioNum, JSON.stringify(err));
      return callback(err, null);
    }
    
    // delete user
    if (message === "delete") {
      User.remove({phone_number: phoneNumber}).exec();
      callback(null, user);
    // otherwise handle "stop" or "restart"
    } else {
      user.daily_text = message === "remove" ? false : true;
      user.save(function(err) {
        if (err) return callback(err, null);
        callback(null, user);
      })
    }
  });
}