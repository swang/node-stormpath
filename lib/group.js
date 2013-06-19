'use strict';

var util = require('util')

var Abstract = require('./abstract')
  , Account = require('./account')

var Group = function() {
  Abstract.apply(this, arguments)
  this.setPath("groups")
}

util.inherits(Group, Abstract)

Group.prototype.getAccounts = function() {

  var args = Array.prototype.slice.call(arguments)

  if (this.expanded['accounts']) {
    return args.pop()(null, this.expanded['accounts'])
  }

  this.requestList(Account, 'GET', ['groups', this.id, 'accounts']).apply(this, arguments)
}

Group.prototype.getAccountMemberships = function() {

  var args = Array.prototype.slice.call(arguments)

  if (this.expanded['accounts']) {
    return args.pop()(null, this.expanded['accountMemberships'])
  }

  this.requestList(Account, 'GET', ['groups', this.id, 'accountMemberships']).apply(this, arguments)
}

module.exports = Group