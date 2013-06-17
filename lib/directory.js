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

module.exports = Directory