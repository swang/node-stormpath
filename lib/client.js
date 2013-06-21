'use strict';

var util = require('util')


var Abstract = require('./abstract')
  , Tenant = require('./tenant')

var Client = function() {
  Abstract.apply(this, arguments)
  this.setPath("")
}
util.inherits(Client, Abstract)

Client.prototype.getCurrentTenant = function() {
  this.requestList(Tenant, 'GET', ['tenants', 'current']).apply(this, arguments)
}

module.exports = Client