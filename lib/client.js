'use strict';

var util = require('util')

var Abstract = require('./abstract')
  , Tenant = require('./tenant')

var Client = function() {
  Abstract.apply(this, arguments)
  this.setPath("")
}
util.inherits(Client, Abstract)

Client.prototype.getCurrentTenant = function(callback) {
  var _this = this
  this.request('GET', ['tenants', 'current'], function(err, resp, body) {
    if (err) return callback(err)
    callback(null, new Tenant(_this.options).setData(body))
  })
}

module.exports = Client