var dummyData = [];

var sampleNotes = [
  'Went for a long walk after lunch',
  'My girlfriend broke up with me',
  'I ran my first marathon!',
  'Really really hungover',
  'Got up early and hit some golf balls off the pier',
  'Rainy day in NYC',
  'Worked from Starbucks today',
  'Sent in apps for grad school!',
  'Drove to IKEA to scope out some furniture',
  'Ate something weird for dinner...',
  'Watched Friday Night Lights for 4 hours, ugh',
  'Made my bed',
  'Relaxing at the beach',
  'Our building doesn\'t have warm water today',
  'Spent a couple hours drawing today',
  'Forced my roommate to come with me to see Jai Wolf',
  'Nothing much',
  'Bought a new pair of running shoes',
  'Got kicked out of an H&M for looking suspicious',
  'Spent all day in the park! And brunch.',
  'It\'s so nice outside, can\'t complain',
  'Wrote a bunch of fake notes for the fake account for some app'
];

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

module.exports = function(callback) {
  // build dummy data
  for (var i = 0; i < 20; i++) {
    var data = {};
    data.emotion = parseInt(Math.random() * 11);
    data.hydrate = Math.random() < 0.5 ? true : false;

    data.note = sampleNotes[parseInt(Math.random() * (sampleNotes.length))];
    while (dummyData.indexOf(data.note) >= 0) {
      data.note = sampleNotes[parseInt(Math.random() * (sampleNotes.length))];
    }

    data.date = randomDate(new Date(2015, 0, 1), new Date());
    dummyData.push(data);
  };

  return callback(dummyData);
}

