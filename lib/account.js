'use strict';

var util = require('util')

var Abstract = require('./abstract')
  , Group = require('./group')

var Account = function(options) {
  Abstract.call(this, options)
  this.setPath("accounts")
}

util.inherits(Account, Abstract)

Account.prototype.getGroups = function() {
  this.requestList(Group, 'GET', ['accounts', this.id, 'groups']).apply(this, arguments)
}

module.exports = Account