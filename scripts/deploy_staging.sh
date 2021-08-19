#!/bin/bash
set -xe

ssh -i ./staging_deploy_key albert@$STAGING_SERVER cd jott-note-service

git fetch
git checkout dev
git pull origin dev
docker-compose up -d