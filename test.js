var fs = require('fs');
var path = require('path');
var validate = require('jsonschema').validate;
var schema = require('./schema.json');

// get all the data files
var dataFiles = [].concat(
  fs.readdirSync('./base').map(f => path.join('./base', f)),
  fs.readdirSync('./sgp').map(f => path.join('./sgp', f))
)
var results = [];

// check each file against the schema
dataFiles.forEach(filename => {
  fs.readFile(filename, 'utf8', (err, contents) => {
    var result = validate(JSON.parse(contents), schema);

    // bail out completely if an error is found
    if (result.errors.length) {
      console.error(result);
      console.log('');
      console.error(`There is a problem with ${filename}`);
      process.exit(1);
    } else {
      results.push(`${filename} is valid`);
    }

    // hooray, no errors!
    if (results.length === dataFiles.length) {
      console.log('All data files are valid!');
    }
  })
});
