var fs = require('fs');
var validate = require('jsonschema').validate;
var schema = require('./schema.json');

var results = [];

// get all the file names in this directory
fs.readdir('.', (err, filenames) => {
  if (err) throw err;

  // we're only interested in state data files
  var stateFiles = filenames.filter(filename => {
    return filename.length === 7 && filename.substr(-4) === 'json';
  });

  // check each file against the schema
  stateFiles.forEach(filename => {
    fs.readFile(filename, 'utf8', (err, contents) => {
      var result = validate(JSON.parse(contents), schema);

      // bail out completely if an error is found
      if (result.errors.length) {
        console.error(`There is a problem with ${filename}`);
        console.log('');
        console.error(result);
        process.exit(1);
      } else {
        results.push(`${filename} is valid`);
      }

      // hooray, no errors!
      if (results.length === stateFiles.length) {
        console.log('All data files are valid!');
      }
    })
  });

})
