var url = 'https://raw.githubusercontent.com/CenterForAssessment/Cutscores/master/DEMO/DEMO.json';

const path = require('path');
const express = require('express');
const request = require('superagent');

const app = express();

app.set('json spaces', 2);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

function filterByMinYear (minYear, data) {
  var d = {};

  Object.keys(data).forEach(subject => {
    d[subject] = data[subject].filter(subjectData => {
      return subjectData.maxYear >= minYear || !subjectData.maxYear;
    });
  });

  return d;
}

function filterByMaxYear (maxYear, data) {
  var d = {};

  Object.keys(data).forEach(subject => {
    d[subject] = data[subject].filter(subjectData => {
      return subjectData.minYear <= maxYear;
    });
  });

  return d;
}

function filterBySubject (subject, data) {
  if (!subject) return data;

  var d = {};

  for (var prop in data) {
    if (prop === subject) d[prop] = data[prop];
  }

  return d;
}

app.get('/api/:state/:subject?', (req, res) => {
  // can state be omitted or multiple comma separated?
  request.get(url).end((err, result) => {
    var rawData = JSON.parse(result.text);
    var minYearData = filterByMinYear(req.query.minYear || 1900, rawData);
    var maxYearData = filterByMaxYear(req.query.maxYear || 2100, minYearData);
    var subjectData = filterBySubject(req.params.subject, maxYearData);
    var data = subjectData;

    res.json(data);
  })
});

app.use(function (req, res) {
  res.sendFile(path.join(__dirname, req.url));
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Server listening at http://localhost:' + port);
});
