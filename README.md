# State Assessment Cutscores & Related Meta-Data

The repository contains state specific cutscores and related meta-data in JSON format/

# DEMO

To run the demo, follow these steps:

1. Navigate to the DEMO directory in your terminal
1. If you haven't done so previously, run `npm install`
1. Run `npm run server`
1. Navigate to http://localhost:3000/ to view the chart or http://localhost:3000/api/ri/ to view the API results

### Note

You can add a `/{subject}` to the URL to filter by subject (`ela` or `mathematics`, currently), and/or `minYear`/`maxYear` as a querystring parameter. Some example URLs are below.

- http://localhost:3000/api/ri/ela
- http://localhost:3000/api/ri/ela?minYear=2015
- http://localhost:3000/api/ri/ela?minYear=2007&maxYear=2013
