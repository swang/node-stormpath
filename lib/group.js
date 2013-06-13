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
  var args = Array.prototype.slice.call(arguments), callback, opts;
  if (args.length === 1) { callback = args[0] }
  if (args.length === 2) { opts = args[0]; callback = args[1] }
  this.requestList(Account)('GET', ['groups', this.id, 'accounts'], callback)
}

module.exports = Group