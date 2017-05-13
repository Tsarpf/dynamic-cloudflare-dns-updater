docker run --restart=always --volume $(pwd)/settings:/www/settings --network=host tsarpf/cloudflare-dns-updater:latest
