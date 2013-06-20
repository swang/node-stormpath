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

module.exports = Tenant