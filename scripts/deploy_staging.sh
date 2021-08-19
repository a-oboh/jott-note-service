#!/bin/bash
set -xe

ssh albert@$STAGING_SERVER
cd jott-note-service
git fetch
git checkout dev
git pull origin dev
docker-compose up -d