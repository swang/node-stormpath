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
  var args = Array.prototype.slice.call(arguments), callback, opts;
  if (args.length === 1) { callback = args[0] }
  if (args.length === 2) { opts = args[0]; callback = args[1] }
  this.requestList(Group)('GET', ['accounts', this.id, 'groups'], callback)
}

module.exports = Account