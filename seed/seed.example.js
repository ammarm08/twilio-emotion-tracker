var db = require('../server/db/database');
var Data = require('../server/db/models').Data;
var User = require('../server/db/models').User;

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

var dummyData = [];

// ADD YOUR INFO HERE
var NAME = "YOUR_NAME";
var GOOGLEID = parseInt("YOUR_GOOGLE_ID");
var PHONE_NUMBER = "+1YOURNUMBERNOSPACES";

// create a new user
new User({
  name: NAME,
  googleid: GOOGLEID,
  phone_number: PHONE_NUMBER
}).save(function() {
  //WOOHOO!
});

// build dummy data
for (var i = 0; i < 20; i++) {
  var data = {};
  data.emotion = parseInt(Math.random() * 11);
  data.hydrate = Math.random() < 0.5 ? true : false;
  data.note = "This is a test note";
  data.date = randomDate(new Date(2015, 0, 1), new Date());
  dummyData.push(data);
};

// add each element in dummyData array to user's data collection
User.findOne({googleid: GOOGLEID}, function(err, user) {
  if (err) return console.error(err);

  console.log(user);

  for (var i = 0; i < dummyData.length; i++) {
    user.children.push(dummyData[i]);
  }

  user.save(function(err) {
    if (err) return console.error(err);
    console.log("Dummy data added!");
    console.log(user.children);
  });

});

