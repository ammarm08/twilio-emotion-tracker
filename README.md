# Twilio Emotion Tracker #

- Respond to text: "On a scale of 1-10, how was your day?"
- Include some more qualitative info (did you hydrate? anything notable happen today?)
- Respond to this text every day
- Login to your dashboard and see trends over time ("My mood sucks on Mondays or when I don't work out")

### Next Steps ###

- ~~[Automation] Worker to send out a text reminder every day~~
- ~~[Twilio] Send a welcome message upon phone number registration~~
- [ ] [Twilio] If text == "Stop", remove user from daily text
- [ ] [Twilio] If text == "Restart", get user back onto daily text
- [ ] [DB] If text == "Delete", delete user from DB
- [ ] [Security] Double check authorization/authentication for each route
- [ ] [UI] Build React+Flux front-end that displays a table of all user data
- [ ] [UI] Display user data as data visualizations (D3/Highcharts/Crossfilter)
- [ ] [UI] Tooltips: on hover, show a specific day's note + more details
- [ ] [Automation] Write build scripts to Browserify, bundle, and deploy app
- [ ] [Test] Write unit test suite for DB entries, Twilio endpoints, user auth
- [ ] [Automation] Incorporate Travis for continuous deployment
- [ ] [Security] Build user panel where user can edit his account settings
- [ ] [UI] Allow user to edit/add/delete note for a given day
- [ ] [Deployment] Shift over to Docker? (just for funsies)
