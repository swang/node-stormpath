'use strict';

var util = require('util')

var Abstract = require('./abstract')
  , Account = require('./account')

var Group = function(options) {
  Abstract.call(this, options)
  this.setPath("groups")
}

util.inherits(Group, Abstract)

Group.prototype.getAccounts = function() {
  this.requestList(Account, 'GET', ['groups', this.id, 'accounts']).apply(this, arguments)
}

Group.prototype.getAccountMemberships = function() {
  this.requestList(Account, 'GET', ['groups', this.id, 'accountMemberships']).apply(this, arguments)
}

module.exports = Group