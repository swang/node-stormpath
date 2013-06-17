'use strict';

var util = require('util')

var Abstract = require('./abstract')
  , Group = require('./group')

var Account = function() {
  Abstract.apply(this, arguments)
  this.setPath("accounts")
}

util.inherits(Account, Abstract)

Account.prototype.getGroups = function() {
  this.requestList(Group, 'GET', ['accounts', this.id, 'groups']).apply(this, arguments)
}

module.exports = Account