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
  this.requestList(Directory, 'GET', ['tenants', this.id, 'applications']).apply(this, arguments)
}

Tenant.statusCode = {
  200: "OK  The request was successful and the response body contains the representation requested.",
  302: "FOUND A common redirect response; you can GET the representation at the URI in the location response header.",
  304: "NOT MODIFIED  Your client's cached version of the representation is still up to date.",
  401: "UNAUTHORIZED  Authentication credentials are required to access the resource. All requests must be authenticated.",
  403: "FORBIDDEN The supplied authentication credentials are not sufficient to access the resource.",
  404: "NOT FOUND We could not locate the resource based on the specified URI.",
  415: "UNSUPPORTED MEDIA TYPE  The requested media type in the Accept header is unsupported. Stormpath's REST API currently only supports application/json.",
  429: "TOO MANY REQUESTS Your application is sending too many simultaneous requests.",
  500: "SERVER ERROR  We could not return the representation due to an internal server error.",
  503: "SERVICE UNAVAILABLE We are temporarily unable to service the request. Please wait for a bit and try again."
}

module.exports = Tenant