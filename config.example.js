/*
STEPS:

1. Add your keys
2. Rename file to config.js

*/

module.exports = {
  google: {
    clientID: "YOUR_GOOGLE_API_CLIENT_ID",
    clientSecret: "YOUR_GOOGLE_API_CLIENT_SECRET"
  },
  twilio: {
    account: "YOUR_TWILIO_ACCOUNT_SID",
    token: "YOUR_TWILIO_AUTH_TOKEN",
    number: "YOUR_TWILIO_PHONE_NUMBER"
  },
  test: {
    name: "YOUR_NAME",
    googleid: "YOUR_GOOGLE_ID", // this should be a Number, not a String
    number: "+1YOUR_PHONE_NUMBER", // for testing DB writes/deletes/updates
  }
};