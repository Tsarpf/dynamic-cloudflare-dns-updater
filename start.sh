#!/bin/bash
docker run --restart=always --network=host \
    -e CLOUDFLARE_EMAIL_ADDRESS="" \
    -e CLOUDFLARE_GLOBAL_API_KEY="" \
    -e NEW_ADDRESS="" \
    -e DOMAIN="" \
    -e UPDATE_INTERVAL="" \
    tsarpf/cloudflare-dns-updater:latest
