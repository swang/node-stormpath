'use strict';

var util = require('util')

var Abstract = require('./abstract')
  , Account = require('./account')
  , Group = require('./group')
  , LoginAttempt = require('./loginAttempt')
  , PasswordResetToken = require('./passwordResetToken')

var Application = function() {
  Abstract.apply(this, arguments)
  this.setPath("applications")
}
util.inherits(Application, Abstract)

Application.prototype.getAccounts = function() {
  var args = Array.prototype.slice.call(arguments)

  if (this.expanded['accounts']) {
    return args.pop()(null, this.expanded['accounts'])
  }
  this.requestList(Account, 'GET', ['applications', this.id, 'accounts']).apply(this, arguments)
}

Application.prototype.getGroups = function() {
  var args = Array.prototype.slice.call(arguments)

  if (this.expanded['groups']) {
    return args.pop()(null, this.expanded['groups'])
  }

  this.requestList(Group,'GET', ['applications', this.id, 'groups']).apply(this, arguments)
}

Application.prototype.getLoginAttempts = function() {
  var args = Array.prototype.slice.call(arguments)

  if (this.expanded['loginAttempts']) {
    return args.pop()(null, this.expanded['loginAttempts'])
  }

  this.requestList(LoginAttempt, 'GET', ['applications', this.id, 'loginAttempts']).apply(this, arguments)
}

Application.prototype.getPasswordResetTokens = function() {
  var args = Array.prototype.slice.call(arguments)

  if (this.expanded['passwordResetTokens']) {
    return args.pop()(null, this.expanded['accounts'])
  }

  this.requestList(PasswordResetToken, 'GET', ['applications', this.id, 'passwordResetTokens']).apply(this, arguments)
}

Application.prototype.createAccount = function(data, callback) {
  this.request('POST', ['applications', this.id, 'accounts'], data, callback)
}

Application.prototype.createLoginAttempt = function(data, callback) {
  this.request('POST', ['applications', this.id, 'loginAttempts'], data, callback)
}

Application.prototype.createPasswordResetToken = function(data, callback) {
  this.request('POST', ['applications', this.id, 'passwordResetToken'], data, callback)
}

module.exports = Application