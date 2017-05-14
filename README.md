# Dynamic cloudflare dns updater
Updates *all* IPs for a zone/domain on cloudflare to your public ip address or address set in config

## Before running:
- Set the environment variables in start.sh
    * leave `UPDATE_INTERVAL` blank run only once
    * leave `NEW_ADDRESS` blank to automatically try to use your public IP (no guarantees!)
    * set `IP_ADDRESS` if you don't want to detect the new public IP automatically

## Running
### If you have Docker
- Just run start.sh since the image is already in docker hub, and it will download the image, start running, automatically start back up if the server restarts etc.

### Without docker, if you have Node & npm
- Remember to set up environment variables (see start.sh)
- `npm install`
- `npm start`
