#!/bin/bash
echo "starting bash..."
echo $(date)

echo "current working directory is " $PWD

if [ -n "$TARGET_BRANCH" ]; then
  git config --local user.email "action@github.com" && git config --local user.name "GithubActions"
  remote_repo="https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
  git push "${remote_repo}" --delete $TARGET_BRANCH
  git checkout -b $TARGET_BRANCH
fi

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

rm -rf ./metadata

if [ -d "unpackaged" ]; then
  rm -r ./unpackaged
fi

unzip unpackaged.zip

rm unpackaged.zip

mv ./unpackaged ./metadata

echo "Fetching ApexClass Changes"
sfdx force:data:soql:query -q "SELECT LastModifiedDate,Name,LastModifiedBy.Name FROM ApexClass ORDER BY LastModifiedDate DESC NULLS LAST" -u sfLogin --json > changesApexClass.json
echo "Fetching ApexComponent Changes"
sfdx force:data:soql:query -q "SELECT LastModifiedDate,Name,LastModifiedBy.Name FROM ApexComponent ORDER BY LastModifiedDate DESC NULLS LAST" -u sfLogin --json > changesApexComponent.json
echo "Fetching ApexPage Changes"
sfdx force:data:soql:query -q "SELECT LastModifiedDate,Name,LastModifiedBy.Name FROM ApexPage ORDER BY LastModifiedDate DESC NULLS LAST" -u sfLogin --json > changesApexPage.json
echo "Fetching ApexTrigger Changes"
sfdx force:data:soql:query -q "SELECT LastModifiedDate,Name,LastModifiedBy.Name FROM ApexTrigger ORDER BY LastModifiedDate DESC NULLS LAST" -u sfLogin --json > changesApexTrigger.json
echo "Fetching AuraDefinitionBundle Changes"
sfdx force:data:soql:query -q "SELECT LastModifiedDate,DeveloperName,LastModifiedBy.Name FROM AuraDefinitionBundle ORDER BY LastModifiedDate DESC NULLS LAST" -u sfLogin --json > changesAuraDefinitionBundle.json
echo "Fetching StaticResource Changes"
sfdx force:data:soql:query -q "SELECT LastModifiedDate,Name,LastModifiedBy.Name FROM StaticResource ORDER BY LastModifiedDate DESC NULLS LAST" -u sfLogin --json > changesStaticResource.json
echo "Fetching FlowDefinition Changes"
sfdx force:data:soql:query -q "SELECT LastModifiedDate,ApiName,LastModifiedBy FROM FlowDefinitionView ORDER BY LastModifiedDate DESC NULLS LAST" -u sfLogin --json > changesFlowDefinitions.json


echo "Fetching FlexiPage Changes"
sfdx force:mdapi:listmetadata -m FlexiPage -u sfLogin --json > changesFlexiPages.json
echo "Fetching Lightning Web Component Changes"
sfdx force:mdapi:listmetadata -m LightningComponentBundle -u sfLogin --json > changesLWC.json
echo "Fetching Profile Changes"
sfdx force:data:soql:query -q "SELECT LastModifiedDate,Name,LastModifiedBy.Name FROM Profile ORDER BY LastModifiedDate DESC NULLS LAST" -u sfLogin --json > changesProfile.json
echo "Fetching Permissions Set Changes"
sfdx force:data:soql:query -q "SELECT LastModifiedDate,Name,LastModifiedBy.Name FROM PermissionSet ORDER BY LastModifiedDate DESC NULLS LAST" -u sfLogin --json > changesPermissionSet.json
echo "Fetching Validation Rule Changes"
sfdx force:mdapi:listmetadata -m ValidationRule -u sfLogin --json > changesValidationRules.json
echo "Fetching Custom Object Changes"
sfdx force:mdapi:listmetadata -m CustomObject -u sfLogin --json > changesCustomObject.json
echo "Fetching Custom Field Changes"
sfdx force:mdapi:listmetadata -m CustomField -u sfLogin --json > changesCustomField.json

node /action/commitChanges.js