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