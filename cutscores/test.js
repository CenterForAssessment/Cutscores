const dir = require('fs').readdirSync;
const file = require('fs').readFile;
const join = require('path').join;
const validate = require('jsonschema').validate;
const schema = require('./schema.json');

// get all the data files
const dataFiles = []
  .concat(
    dir(join(__dirname, './base')).map(f => join(__dirname, './base', f)),
    dir(join(__dirname, './sgp')).map(f => join(__dirname, './sgp', f))
  )
  .filter(filename => filename.substr(-4) === 'json');

var results = [];

// check each file against the schema
dataFiles.forEach(filename => {
  file(filename, 'utf8', (err, contents) => {
    const result = validate(JSON.parse(contents), schema);

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
