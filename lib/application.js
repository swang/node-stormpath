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
  this.requestList(Account, 'GET', ['applications', this.id, 'accounts']).apply(this, arguments)
}

Application.prototype.getGroups = function() {
  this.requestList(Group,'GET', ['applications', this.id, 'groups']).apply(this, arguments)
}

Application.prototype.getLoginAttempts = function() {
  this.requestList(LoginAttempt, 'GET', ['applications', this.id, 'loginAttempts']).apply(this, arguments)
}

Application.prototype.getPasswordResetTokens = function() {
  this.requestList(PasswordResetToken, 'GET', ['applications', this.id, 'passwordResetTokens']).apply(this, arguments)
}

module.exports = Application