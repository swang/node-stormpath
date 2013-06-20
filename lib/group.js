'use strict';

var util = require('util')

var Abstract = require('./abstract')
  , Account

var Group = function() {
  Abstract.apply(this, arguments)
  this.setPath("groups")
  // avoid circular reference
  Account = require('./account')
}

util.inherits(Group, Abstract)

Group.prototype.getAccounts = function() {
  this.requestList(Account, 'GET', ['groups', this.id, 'accounts']).apply(this, arguments)
}

Group.prototype.getAccountMemberships = function() {
  this.requestList(Account, 'GET', ['groups', this.id, 'accountMemberships']).apply(this, arguments)
}

module.exports = Group