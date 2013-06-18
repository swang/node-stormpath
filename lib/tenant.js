'use strict';

var util = require('util')

var Abstract = require('./abstract')
  , Application = require('./application')
  , Directory = require('./directory')

var Tenant = function() {
  Abstract.apply(this, arguments)
  this.setPath('tenants')
}

util.inherits(Tenant, Abstract)

Tenant.prototype.getApplications = function() {
  this.requestList(Application, 'GET', ['tenants', this.id, 'applications']).apply(this, arguments)
}

Tenant.prototype.getDirectories = function() {
  this.requestList(Directory, 'GET', ['tenants', this.id, 'directories']).apply(this, arguments)
}

Tenant.statusCode = {
  "302": {
    code: "FOUND",
    message: "A common redirect response; you can GET the representation at the URI in the location response header."
  },
  "304": {
    code: "NOT MODIFIED",
    message: "Your client's cached version of the representation is still up to date."
  },
  "401": {
    code: "UNAUTHORIZED",
    message: "Authentication credentials are required to access the resource. All requests must be authenticated."
  },
  "403": {
    code: "FORBIDDEN",
    message: "The supplied authentication credentials are not sufficient to access the resource."
  },
  "404": {
    code: "NOT FOUND",
    message: "We could not locate the resource based on the specified URI."
  },
  "415": {
    code: "UNSUPPORTED MEDIA TYPE",
    message: "The requested media type in the Accept header is unsupported. Stormpath's REST API currently only supports application/json."
  },
  "429": {
    code: "TOO MANY REQUESTS",
    message: "Your application is sending too many simultaneous requests."
  },
  "500": {
    code: "SERVER ERROR",
    message: "We could not return the representation due to an internal server error."
  },
  "503": {
    code: "SERVICE UNAVAILABLE",
    message: "We are temporarily unable to service the request. Please wait for a bit and try again."
  }
}

module.exports = Tenant