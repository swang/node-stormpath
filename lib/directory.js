'use strict';

var util = require('util')

var Abstract = require('./abstract')
  , Account = require('./account')
  , Group = require('./group')

var Directory = function(options) {
  Abstract.call(this, options)
  this.setPath('directories')
}

util.inherits(Directory, Abstract)

Directory.prototype.getAccounts = function() {
  var args = Array.prototype.slice.call(arguments), callback, opts;
  if (args.length === 1) { callback = args[0] }
  if (args.length === 2) { opts = args[0]; callback = args[1] }
  this.requestList(Account)('GET', ['directories', this.id, 'accounts'], callback)
}
Directory.prototype.getGroups = function() {
  var args = Array.prototype.slice.call(arguments), callback, opts;
  if (args.length === 1) { callback = args[0] }
  if (args.length === 2) { opts = args[0]; callback = args[1] }
  this.requestList(Group)('GET', ['directories', this.id, 'groups'], callback)
}

module.exports = Directory