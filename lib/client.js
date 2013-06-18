'use strict';

var qs = require('querystring')
  , util = require('util')


var Abstract = require('./abstract')
  , Tenant = require('./tenant')

var Client = function() {
  Abstract.apply(this, arguments)
  this.setPath("")
}
util.inherits(Client, Abstract)

Client.prototype.getCurrentTenant = function() {
  var args = Array.prototype.slice.call(arguments), _this = this, opts, callback, uri

  if (args.length === 1) { callback = args[0] }
  if (args.length === 2) { opts = args[0]; callback = args[1] }
  uri = ['tenants', 'current']
  if (opts) { uri.push("?" + qs.stringify(opts)) }
  this.request('GET', uri, function(err, resp, body) {
    if (err) return callback(err)
    callback(null, new Tenant(_this.options).setData(body))
  })
}

module.exports = Client