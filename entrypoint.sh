#!/bin/bash
echo "starting bash..."
echo $(date)

echo "current working directory is " $PWD

export current_dir=$PWD
cd /action
node writeKey.js

if [ -z "$SF_INSTANCE_URL" ]; then
    sfdx force:auth:jwt:grant --clientid="$SF_CLIENT_ID" --username="$SF_USERNAME" --jwtkeyfile ./server.key --setdefaultdevhubusername --setalias sfLogin
else
    sfdx force:auth:jwt:grant --instanceurl="$SF_INSTANCE_URL" --clientid="$SF_CLIENT_ID" --username="$SF_USERNAME" --jwtkeyfile ./server.key --setdefaultdevhubusername --setalias sfLogin
fi

cd $current_dir

sfdx force:mdapi:retrieve -r ./ -u sfLogin -k ./package.xml -w 20

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