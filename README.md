# udemy wallet
This repo is a clone of the [mixwallet](https://github.com/over140/mixwallet) web infrastructure code (webpack, nginx, locale, etc).  It is purely for educational purposes as the Mixin RPC code will be added as part of the Mixin Network Udemy course.  Therefore, it should not be used as an actual wallet on the Mixin Network as no security guarantees are made whatsoever.  You've been warned.

### Get Started

##### Register develper account
You need a Mixin Messenger account to create a developer account. Visit https://mixin.one/messenger to download the mobile app and create an account, then visit https://developers.mixin.one/dashboard. Use the Mixin Messenger camera to scan the QR code, and give permissions to the developer website.

##### Create app
After you have logged in, click Create New App to create your first app.
![dev-guide](https://developers.mixin.one/api/images/register-app.png)


##### Nginx
Install nginx and config nginx.conf, `sudo nginx` to start nginx.

##### Config
Replace app id, private key, and session id from your app infomation in webpack.config.js (don't forget to include -----BEGIN RSA PRIVATE KEY----- and -----END RSA PRIVATE KEY----- in the private key).

##### Run
`npm install` to install dependencies, `npm run watch` to run the project.
