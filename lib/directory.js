'use strict';

var util = require('util')

var Abstract = require('./abstract')
  , Account = require('./account')
  , Group = require('./group')

var Directory = function() {
  Abstract.apply(this, arguments)
  this.setPath('directories')
}

util.inherits(Directory, Abstract)

Directory.prototype.getAccounts = function() {
  this.requestList(Account, 'GET', ['directories', this.id, 'accounts']).apply(this, arguments)
}

Directory.prototype.getGroups = function() {
  this.requestList(Group, 'GET', ['directories', this.id, 'groups']).apply(this, arguments)
}

Directory.prototype.createAccount = function(data, callback) {
  this.request('POST', ['directories', this.id, 'accounts'], data, callback)
}

Directory.prototype.createGroup = function(data, callback) {
  this.request('POST', ['directories', this.id, 'groups'], data, callback)
}

module.exports = Directory