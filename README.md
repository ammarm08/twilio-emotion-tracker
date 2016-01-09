# Sigmund #
### A curmudgeonly old professor sending you a daily reminder to track your emotional well-being ###

- Respond to text: "On a scale of 1-10, how was your day?"
- Include some more qualitative info (did you hydrate? anything notable happen today?)
- Respond to this text every day
- Login to your dashboard and see trends over time ("My mood sucks on Mondays or when I don't work out")

### Getting Started ###

```
npm install -g nodemon
npm install

mongod

go to config.example.js and follow the instructions.

// will build, test, and run server on port 3000, while watching for errors as you make them in src/
npm run watch

// if you don't want watchify chirping at you, run this (it won't prompt you of any errors you make in src/ though)
npm run dev-server

```

### Next Steps ###

- ~~[Automation] Worker to send out a text reminder every day~~
- ~~[Twilio] Send a welcome message upon phone number registration~~
- ~~[Twilio] If text == "Stop", remove user from daily text~~
- ~~[Twilio] If text == "Restart", get user back onto daily text~~
- ~~[DB] If text == "Delete", delete user from DB~~
- ~~[Security] Double check authorization/authentication for each route~~
- ~~[UI] Display user data as data visualizations (D3/Highcharts/Crossfilter)~~
- ~~[UI] Tooltips: on hover, show a specific day's note + more details~~
- ~~[Automation] Write build scripts to Browserify, bundle, and deploy app~~
- ~~[Test] Write unit test suite for DB entries, Twilio endpoints, user auth~~
- ~~[UX] Give Sigmund a personality (curmudgeonly German philosopher)~~
- ~~[UI] Build React+Flux front-end~~
- [ ] [UX] Revamp web app design
- ~~[Automation] Incorporate Travis for continuous deployment~~
- [ ] [UI] Allow user to edit/add/delete note for a given day
- [ ] [Security] Build user panel where user can edit his account settings

