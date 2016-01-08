var db = require('../server/db/database');
var Data = require('../server/db/models').Data;
var User = require('../server/db/models').User;

var NAME = process.env.ADMIN_NAME || require('../config.js').test.name;
var GOOGLEID = process.env.ADMIN_GOOGLEID || require('../config.js').test.googleid;
var PHONE_NUMBER = process.env.ADMIN_NUM || require('../config.js').test.number;

var dummyData = [];

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

//BLAST EXISTING COLLECTION
Data.remove({}).exec();
User.remove({}).exec();

// create a new user
new User({
  name: NAME,
  googleid: GOOGLEID,
  phone_number: PHONE_NUMBER
}).save(function(err) {
  if (err) return db.close();
  console.log('[CREATED] User: ' + NAME);
})

// build dummy data
for (var i = 0; i < 20; i++) {
  var data = {};
  data.emotion = parseInt(Math.random() * 11);
  data.hydrate = Math.random() < 0.5 ? true : false;
  data.note = "This is a test note";
  data.date = randomDate(new Date(2015, 0, 1), new Date());
  dummyData.push(data);
};

console.log('[POPULATED] Dummy data array');

// add each element in dummyData array to user's data collection
User.findOne({googleid: GOOGLEID}, function(err, user) {
  if (err) {
    console.error(err);
    return db.close();
  }

  for (var i = 0; i < dummyData.length; i++) {
    user.children.push(dummyData[i]);
  }

  user.save(function(err) {
    if (err) {
      console.error(err);
      return db.close();
    }
    console.log("[CREATED] Dummy data for user: " + NAME);
    db.close();
  });

});

