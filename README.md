Stormpath API wrapper library for node.js
=========================================
node-stormpath aims to provide a complete library for accessing the Stormpath API

[![build status](https://secure.travis-ci.org/swang/node-stormpath.png)](http://travis-ci.org/swang/node-stormpath)

** THIS IS STILL A WORK IN PROGRESS. API MAY CHANGE **

## Requirements

- [node v0.8+](http://nodejs.org/) (may work with v0.6 but no guarantees)

## Install

- npm install node-stormpath

## Getting started

1. Install Stormpath from npm (`npm install node-stormpath`).
2. Get API ID and Secret from your Stormpath install.
3. Generally you will be interacting with one Tenant in Stormpath, so you want to make a simple call to grab your current Tenant info.

```javascript
'use strict';

var c, options, Tenant = require('node-stormpath').Tenant

options = {
  apiId: "<API ID>"
  , apiSecret: "<API Secret>"
}

c = new Client(options)

c.getCurrentTenant(function(err, ten) {
  if (err) console.log(err)
  else { console.log("Tenant id is: " + ten.id) }
})
```

4. Also depending on your application you may only require one application, in which case you can modify the above script to grab all your Applications located in your Tenant

```javascript
'use strict';

var c, options, Tenant = require('node-stormpath').Tenant

options = {
  apiId: "<API ID>"
  , apiSecret: "<API Secret>"
}

c = new Client(options)
c.getCurrentTenant(function(err, ten) {
  if (err) console.log(err)
  else { 
    console.log("Tenant id is: " + ten.id)
    ten.getApplications(function(err, apps) {
      if (err) console.log(err)
      else {
        apps.forEach(function(app) {
          console.log(app.id, "::", app.getData('name'), "::", app.getData('href'), "::", app.getData('status'))
        })
      }
    })
  }
})
```

## Contributors

- [Shuan Wang](https://github.com/swang) [(twitter)](https://twitter.com/swang) (author)

## TODO

- Handle iterating over offset/limit until it exhausts the resource record
- Rethink way to grab new resource URIs
- More tests

## CHANGELOG
0.0.9
- Added support for registrationWorkflowEnabled

0.0.8
- Added support for emailVerificationToken
- Body parameter should only be value of json iff method is POST

0.0.7
- Fixed Abstract.create not passing in an id
- Fixed passwordResetTokens to allow a token to be passed through!

0.0.6
- Have createGroupMembership return a clearer error message when the account or group is invalid or does not exist 
- Fixed some tests

0.0.5
- Added GroupMembership functionality into Application

0.0.4
- Added verifyAccount in Application to handle having to make 2 calls to retrieve a verified user's account information.

0.0.3
- Fix request not causing correct data to be passed for POST calls
- Turned redirects back on (/current/tenants was not properly sending the correct redirect location)

0.0.2
- Basic support for expand
- Bugfixes

0.0.1
- Initial verison
