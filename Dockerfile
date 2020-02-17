FROM node:alpine

LABEL "com.github.actions.name"="Backup Metadata from Salesforce"
LABEL "com.github.actions.description"="Fetches Metadata from a Salesforce System"

LABEL "repository"="https://github.com/BrighterCloud/salesforce-pull-metadata-action"

# install git ca-certificates openssl openssh for CircleCI
# install jq for JSON parsing
RUN apk add --update --no-cache git openssh ca-certificates openssl jq gettext xmlstarlet curl

# install latest sfdx from npm
RUN wget https://developer.salesforce.com/media/salesforce-cli/sfdx-linux-amd64.tar.xz
RUN mkdir sfdx
RUN tar xJf sfdx-linux-amd64.tar.xz -C sfdx --strip-components 1
RUN ./sfdx/install
RUN sfdx --version
RUN sfdx plugins --core

ADD entrypoint.sh /action/entrypoint.sh
ADD writeKey.js /action/writeKey.js
ADD commitChanges.js /action/commitChanges.js

RUN chmod +x /action/entrypoint.sh

# revert to low privilege user
# USER node


ENTRYPOINT ["sh", "/action/entrypoint.sh"] 
