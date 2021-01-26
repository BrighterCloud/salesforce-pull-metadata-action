# How to Setup
## 1. Create Public-Private Keypair
```
openssl genrsa -out privatekey.pem 1024
openssl req -new -x509 -key privatekey.pem -out publickey.cer -days 700
```

## 2. Create Connected App

Create Connected a connected app with the following parameters / options:
- Callback URL z.B. http://localhost
- Use Digital Signatures and upload public key from previous step
- Uncheck Secret for Refresh Token Flow
- Include scopes: full api refresh_token offline_access openid

## 3. Initial Grant for our App
Copy Client ID and Client Secret from the connected app and open the following url in the browser, with adjusted parameters:

https://login.salesforce.com/services/oauth2/authorize?client_id=[clientId]&redirect_uri=http://localhost&response_type=code
This will redirect you to localhost, which is not running a server. Copy the code from the url into the following Url and open it in the browser:
https://test.salesforce.com/services/oauth2/token?grant_type=authorization_code&code=[codeFromRedirect]&client_secret=[clientSecret]&redirect_uri=http://localhost&client_id=[clientId]

## 4. Setup your Repo

Create your repository where you want to backup the changes to. Create a folder .github/workflows and copy the demo.yml from this repository as a starting point.
Addionally copy the package.xml to the root of your git repo.

Create the following github secrets in your repository:
SF_CLIENT_ID_PRODUCTION = [clientId]
SF_PRIVATE_KEY_PRODUCTION = [yourOpensslPrivateKey]
SF_USERNAME_PRODUCTION = [yourSalesforceUsername(email)]

In case your trying to backup a productive instance, you must remove the SF_INSTANCE_URL environment variable from the yaml file.

