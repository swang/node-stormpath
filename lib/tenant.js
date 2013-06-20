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
  var args = Array.prototype.slice.call(arguments)

  if (this.expanded['applications']) {
    return args.pop()(null, this.expanded['applications'])
  }

  this.requestList(Application, 'GET', ['tenants', this.id, 'applications']).apply(this, arguments)
}

Tenant.prototype.setApplications = function(items, callback) {
  var retArray = [], _this = this

  items.forEach(function(item) {
    retArray.push(new Application(_this.options).setData(item))
  })
  this.expanded['applications'] = retArray
  if (callback) { callback(null, retArray) }
}

Tenant.prototype.getDirectories = function() {
  var args = Array.prototype.slice.call(arguments)

  if (this.expanded['directories']) {
    return args.pop()(null, this.expanded['directories'])
  }
  this.requestList(Directory, 'GET', ['tenants', this.id, 'directories']).apply(this, arguments)
}

module.exports = Tenant