require('dotenv').config();
const express = require('express');
const app = express();

// Enable cross-origin resource sharing
// so freeCodeCamp can remotely test the app
const cors = require('cors');
// Some legacy browsers choke on 204
app.use(cors({optionsSuccessStatus: 200}));

// Declare location of static assets (CSS, JS, images)
app.use(express.static('public'));


// Set app's main page
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
When the user navigates to /api,
the app will return the following JSON:
{
  unix: current time in ms,
  utc: current date string
}
*/
app.get('/api', function (req, res) {
  const d = new Date();
  const dateJSON = {
    unix: d.valueOf(),
    utc: d.toUTCString()
  };
  res.json(dateJSON);
});


/*
When the user navigates to /api/:date,
assuming the "date" parameter is valid,
the app will return the following JSON: 
{
  unix: "date" in ms,
  utc: "date" as a string
}

For example:

User accessed:
/api/2015-12-25
or
/api/1451001600000

App will return:
{
  unix: 1451001600000,
  utc: 'Fri, 25 Dec 2015 00:00:00 GMT'
}
*/
app.get('/api/:date', function (req, res) {
  let d;
  if (/\D/.test(req.params.date)) {
    // Since there were non-numeric characters,
    // assume "date" is a date string, e.g. 2015-12-25
    d = new Date(req.params.date);
  } else {
    // Since "date" was entirely numeric,
    // treat it as milliseconds since epoch
    d = new Date(Number(req.params.date));
  }
        
  // Check whether the Date object is valid
  if (!(d instanceof Date) || isNaN(d)) {
    res.json({error: 'Invalid Date'});
  } else {
    const dateJSON = {
      unix: d.valueOf(),
      utc: d.toUTCString()
    };
    res.json(dateJSON);
  }
});


// Listen for requests
const port = ('PORT' in process.env) ? process.env.PORT : 3000;
const listener = app.listen(port, () => {
  console.log(`The app is listening on port ${port}.`);
});
