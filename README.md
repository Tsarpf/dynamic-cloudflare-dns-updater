# Dynamic cloudflare dns updater
Updates *all* IPs for a zone/domain on cloudflare to your public ip address or address set in config

## Before running:
* leave `newAddress` blank to automatically use your public IP (no guarantees it's the correct one!)
* Leave `updateInterval` field blank to run just once
* Environment variables override other settings if both are set
- With environment variables, set:
   * `TARGET_DOMAIN=http://example.com`
   * `UPDATE_INTERVAL_MS=900000`
   * `IP_ADDRESS=127.0.0.1`
   * `EMAIL=your.cloudflare@email.com`
   * `AUTH_KEY=your_global_api_key_from_cloudflare_settings`
- OR copy `settings/settings.json.example` to `settings/settings.json` and type in the settings there

## Running
### If you have Docker
- Remember to set up `settings/settings.json`, see above 
- Just run `docker run --restart=always --volume $(pwd)/settings:/www/settings --network=host tsarpf/cloudflare-dns-updater:latest` since the image is already in docker hub, and it will download the image, start running, automatically start back up if the server restarts etc.
- You can also use `./start.sh`

### Without docker, if you have Node & npm
- Remember to set up `settings/settings.json`, see above
- `npm install`
- `npm start`
