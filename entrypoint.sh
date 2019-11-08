#!/bin/bash
echo "starting bash..."
echo $(date)

echo "current working directory is " $PWD

export current_dir=$PWD
cd /action
node writeKey.js

sfdx force:auth:jwt:grant --instanceurl="$SF_INSTANCE_URL" --clientid="$SF_CLIENT_ID" --username="$SF_USERNAME" --jwtkeyfile ./server.key --setdefaultdevhubusername --setalias sfLogin

cd $current_dir

git checkout $GITHUB_BRANCH

sfdx force:mdapi:retrieve -r ./ -u $SFDX_ORG -k ./package.xml -w 20

if [ ! -f "unpackaged.zip" ]; then
  echo "failed to download metadata file"
  exit 1
fi

rm -rf ./metadata/*

if [ -d "unpackaged" ]; then
  rm -r ./unpackaged
fi

unzip unpackaged.zip

rm unpackaged.zip

mv ./unpackaged ./metadata

git checkout $GITHUB_BRANCH
git add .
git commit -a -m "Daily iSales metadata backup"
git push