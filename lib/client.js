'use strict';

var qs = require('querystring')
  , util = require('util')


var Abstract = require('./abstract')
  , Tenant = require('./tenant')
  , h = require('./helper')

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

  if (opts) {
    if (opts.expand) { this._expand = opts.expand; opts.expand = h.expandHandler(opts.expand) || "" }
    uri.push("?" + qs.stringify(opts))
  }

  this.request('GET', uri, opts, function(err, resp, body) {
    var nt, expands
    if (err) return callback(err)
    nt = new Tenant(_this.options).setData(body)
    if (opts && _this._expand) {
      expands = _this._expand.split(",")
      expands.forEach(function(resource) {
        if (body[resource] && body[resource].items) {
          nt["set" + h.titleCase(resource.toString())](body[resource].items)
        }
      })
    }
    callback(null, nt)
  })
}

module.exports = Client