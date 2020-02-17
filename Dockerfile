FROM node:alpine

LABEL "com.github.actions.name"="Backup Metadata from Salesforce"
LABEL "com.github.actions.description"="Fetches Metadata from a Salesforce System"

LABEL "repository"="https://github.com/BrighterCloud/salesforce-pull-metadata-action"

# install git ca-certificates openssl openssh for CircleCI
# install jq for JSON parsing
RUN apk add --update --no-cache git openssh ca-certificates openssl jq gettext xmlstarlet curl

# install latest sfdx from npm
RUN npm install sfdx-cli --global
RUN sfdx --version
RUN sfdx plugins --core

ADD entrypoint.sh /action/entrypoint.sh
ADD writeKey.js /action/writeKey.js
ADD commitChanges.js /action/commitChanges.js

RUN chmod +x /action/entrypoint.sh

# revert to low privilege user
# USER node


ENTRYPOINT ["sh", "/action/entrypoint.sh"] 
