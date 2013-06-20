Stormpath API wrapper library for node.js
=========================================
node-stormpath aims to provide a complete library for accessing the Stormpath API

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

- Add better support for ?expand
- Handle iterating over offset/limit until it exhausts the resource record
## CHANGELOG

0.0.2
- Basic support for expand
- Bugfixes

0.0.1
- Initial verison