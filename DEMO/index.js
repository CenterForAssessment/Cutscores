// var url = 'https://raw.githubusercontent.com/CenterForAssessment/Cutscores/master/DEMO/DEMO.json';
var url = 'http://localhost:3000/DEMO.json';

const path = require('path');
const express = require('express');
const request = require('superagent');

const app = express();

app.set('json spaces', 2);

function filterByMinYear (minYear, data) {
  return data.filter(subject => {
    subject.data = subject.data.filter(cutSet => {
      return cutSet.maxYear >= minYear || !cutSet.maxYear;
    });
    return subject.data.length;
  });
}

function filterByMaxYear (maxYear, data) {
  return data.filter(subject => {
    subject.data = subject.data.filter(cutSet => {
      return cutSet.minYear <= maxYear;
    });
    return subject.data.length;
  });
}

function filterBySubject (subject, data) {
  return data.filter(subjectData => !subject || subjectData.subject === subject);
}

app.get('/api/:state/:subject?', (req, res) => {
  // can state be omitted or multiple comma separated?
  request.get(url).end((err, result) => {
    var allData = JSON.parse(result.text);
    var filteredData = allData.data;

    filteredData = filterBySubject(req.params.subject, filteredData);
    filteredData = filterByMinYear(req.query.minYear || 1900, filteredData);
    filteredData = filterByMaxYear(req.query.maxYear || 2100, filteredData);

    res.json({
      metadata: allData.metadata,
      data: filteredData
    });
  })
});

// serve the UI and its dependencies
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.use(function (req, res) {
  res.sendFile(path.join(__dirname, req.url));
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Server listening at http://localhost:' + port);
});
