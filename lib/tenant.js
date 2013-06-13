'use strict';

var qs = require('querystring')
  , util = require('util')

var Abstract = require('./abstract')
  , Application = require('./application')
  , Directory = require('./directory')

var Tenant = function(options) {
  Abstract.call(this, options)
  this.setPath('tenants')
}

util.inherits(Tenant, Abstract)

Tenant.prototype.getApplications = function() {
  var args = Array.prototype.slice.call(arguments), callback, opts, _this = this, url;

  if (args.length === 1) { callback = args[0] }
  if (args.length === 2) { opts = args[0]; callback = args[1] }
  url = ['tenants', this.id, 'applications']
  if (opts) { url.push("?" + qs.stringify(opts)) }
  
  this.request('GET', url, function(err, resp, body) {

    if (err) { return callback(err) }

    var retArray = [];
    body.items.forEach(function(app) {
      retArray.push(new Application(_this.options).setData(app).extractId(app.href))
    })

    callback(null, retArray)
  })
}

Tenant.prototype.getDirectories = function() {
  var args = Array.prototype.slice.call(arguments), callback, opts, _this = this, url;

  if (args.length === 1) { callback = args[0] }
  if (args.length === 2) { opts = args[0]; callback = args[1] }
  url = ['tenants', this.id, 'directories']
  if (opts) { url.push("?" + qs.stringify(opts)) }
  this.request('GET', url, function(err, resp, body) {
    if (err) return callback(err)
    var retArray = [];
    body.items.forEach(function(dir) {
      retArray.push(new Directory(_this.options, dir))
    })
    callback(null, retArray)
  })
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