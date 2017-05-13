# Dynamic cloudflare dns updater
Updates *all* IPs for a zone/domain on cloudflare to your public ip address or address set in config

## Before running:
- copy `settings/settings.json.example` to `settings/settings.json`
- type in the settings
    * leave `newAddress` blank to automatically try to use your public IP (no guarantees!)
    * give `IP_ADDRESS` as an environment variable to node to override settings.json ip address AND public ip (for example for running the program periodically while getting the ip address from somewhere else)
    * clear `updateInterval` field completely to run only once

## Running
### If you have Docker
- Remember to set up `settings/settings.json`, see above 
- Just run `docker run --restart=always --volume $(pwd)/settings:/www/settings --network=host tsarpf/cloudflare-dns-updater:latest` since the image is already in docker hub, and it will download the image, start running, automatically start back up if the server restarts etc.
- You can also use `./start.sh`

### Without docker, if you have Node & npm
- Remember to set up `settings/settings.json`, see above
- `npm install`
- `npm start`
