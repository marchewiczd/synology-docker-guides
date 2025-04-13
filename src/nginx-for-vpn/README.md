# nginx for VPN

## /www

Contains simple static HTML to display table with available containers and their ports with a redirection button.

## /htmlGenerator

Contains simple generator for HTML files based on `docker-compose.yaml`.

## How to

1. Place both folders in `/nginx` volume
2. Go into htmlGenerator and run `npm install`
3. Use either `npm run default` to run it with default arguments(docker compose path set to main project directory with `docker-compose.yaml` name of the file and html output set to `/www/`) or `node main.js [docker compose file path] [HTML output path]`, e.g. `node main.js ./docker-compose.yaml ./../www/`
