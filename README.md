# State Assessment Data

This repository contains state and student data in JSON format. Its contents are available on [https://data.literasee.io](https://data.literasee.io) by appending the path of the file you wish to access. For example, Colorado's SGP Cutscores are found at [http://data.literasee.io/cutscores/sgp/CO.json](http://data.literasee.io/cutscores/sgp/CO.json).

# Local Development

To run a local server that mimics the live site, follow these steps:

1. Clone the repository and navigate to its directory on your machine
2. If you haven't done so previously, run `npm install`
3. Run `npm start`
4. Access the repository's files by appending file paths to [http://localhost:4000/](http://localhost:4000/)

# Status as of 11/28/2016

All of the data in this repository is fake and for testing purposes only.

### State level cutscores data

The the cutscores directory is divided into `base` and `sgp` directories to accommodate slightly different schemas. Specifically, the files in the `sgp` directory contain SGP-specific data in `levels_growth` and `cuts_growth` fields. Additionally, the `sgp` directory contains `CO_2015_Grade7.json` an example of a "split" file, which holds cuts data for students whose history spans an assessment change. This file name maps to the optional `metadata.split` field in the student data files. This particular file is referenced by `students/split.json`.

All of the files within `base` and `sgp` must conform to the schema defined in `cutscores/schema.json`. This is enforced via tests in `cutscores/test.js`, which will be run automatically before any commits are allowed.

### Student level historical data

The `students` directory contains samples of various permutations of student data. We have attempted to cover the various non-linear cases such as repeated, skipped, and missing grades, in addition to a standard progression and a student whose history spans an assessment change.

### Availability at data.literasee.io

There are a few things involved in making this repository's contents available at https://data.literasee.io

The `literasee.io` domain (as well as `literasee.org`) is registered with [iwantmyname.com](iwantmyname.com). On that site, the domain's DNS is configured to point to CloudFlare. This is done because CloudFlare offers free SSL (HTTPS) and better subdomain management.

On CloudFlare, we manage the various `literasee.io` subdomains. Some point to Heroku for the Literasee editor and viewer apps, but the `data` subdomain is pointed to `literasee.github.io`, the automatically generated domain for the Literasee organization on GitHub.

The repository itself is then configured to enable GitHub Pages and use the `master` branch as the source. The `CNAME` file in the repository root tells GitHub that requests for `data.literasee.io` should be treated as requests for this repository.