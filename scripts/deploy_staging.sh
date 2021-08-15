set -xe

ssh -i ./staging_deploy_key albert@$STAGING_SERVER
git checkout dev
git pull origin dev