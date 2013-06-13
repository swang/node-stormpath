'use strict';

var util = require('util')

var Abstract = require('./abstract')
  , Account = require('./account')
  , Group = require('./group')
  , PasswordResetToken = require('./passwordResetToken')

var Application = function(options) {
  Abstract.call(this, options)
  this.setPath("applications")
}
util.inherits(Application, Abstract)

Application.prototype.getPasswordResetTokens = function() {
  var args = Array.prototype.slice.call(arguments), callback, opts;
  if (args.length === 1) { callback = args[0] }
  if (args.length === 2) { opts = args[0]; callback = args[1] }
  this.requestList(PasswordResetToken)('GET', ['applications', this.id, 'passwordResetTokens'], callback)
}
Application.prototype.getAccounts = function() {
  var args = Array.prototype.slice.call(arguments), callback, opts;
  if (args.length === 1) { callback = args[0] }
  if (args.length === 2) { opts = args[0]; callback = args[1] }
  this.requestList(Account)('GET', ['applications', this.id, 'accounts'], callback)
}

Application.prototype.getGroups = function() {
  var args = Array.prototype.slice.call(arguments), callback, opts;
  if (args.length === 1) { callback = args[0] }
  if (args.length === 2) { opts = args[0]; callback = args[1] }
  this.requestList(Group)('GET', ['applications', this.id, 'groups'], callback)
}

module.exports = Application