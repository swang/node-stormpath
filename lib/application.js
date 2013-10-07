'use strict';

var util = require('util')

var Abstract = require('./abstract')
  , Account = require('./account')
  , Group = require('./group')
  , GroupMemberships = require('./groupMembership')
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

Application.prototype.getPasswordResetTokens = function(resetToken) {
  // first argument is reset token
  var args = Array.prototype.slice.call(arguments)
    , resetToken = args.shift()

  this.requestList(PasswordResetToken, 'GET', ['applications', this.id, 'passwordResetTokens', resetToken]).apply(this, args)
}

Application.prototype.createAccount = function(data, callback) {
  var uri = ['applications', this.id, 'accounts']
    , workflow

  // ugly hack
  if (data.registrationWorkflowEnabled !== null) {
    workflow = "?registrationWorkflowEnabled=" + data.registrationWorkflowEnabled
    uri.push(workflow)
    delete data.registrationWorkflowEnabled
  }
  this.request('POST', uri, data, callback)
}

Application.prototype.createGroup = function(data, callback) {
  var _this = this
  this.request('POST', ['applications', this.id, 'groups'], data, function(err, group) {
    if (err) return callback(err)
    return callback(null, new Group(_this.options).setData(group.body))
  })
}

Application.prototype.createLoginAttempt = function(data, callback) {
  var _this = this
  this.request('POST', ['applications', this.id, 'loginAttempts'], data, function(err, login) {
    if (err) return callback(err)
    return callback(null, new LoginAttempt(_this.options).setData(login.body))
  })
}

Application.prototype.createPasswordResetToken = function(data, callback) {
  this.request('POST', ['applications', this.id, 'passwordResetTokens'], data, callback)
}

Application.prototype.createGroupMembership = function(acct, group, callback) {
  var _this = this
  _this.getAccounts(acct, function(errAccts, resAccts) {
    if (errAccts) return callback(errAccts)
    if (resAccts.length === 0) return callback({
      status: -1 , message: "Account with properties " + JSON.stringify(acct) + " does not exist"
    });

    _this.getGroups(group, function(errGroups, resGroups) {
      if (errGroups) return callback(errGroups)
      if (resGroups.length === 0) return callback({
        status: -1, message: "Group with properties " + JSON.stringify(group) + " does not exist"
      });

      return new GroupMemberships(_this.options).setData({
        account: {
          href: resAccts[0].getData('href')
        },
        group: {
          href: resGroups[0].getData('href')
        }
      }).create(function(errFinal, body) {
        callback(errFinal, body)
      })
    })
  })
}

Application.prototype.verifyAccount = function(data, callback) {
  var _this = this
  if (data.hasOwnProperty('email') && data.hasOwnProperty('password')) {
    data.type = 'basic'
    data.value = new Buffer(data.email + ":" + data.password).toString("base64")
    delete data.email
    delete data.password
  }
  if (data.hasOwnProperty('type') && data.hasOwnProperty('value')) {
    this.request('POST', ['applications', this.id, 'loginAttempts'], data, function(err, res, body) {
      if (err) return callback(err)
      if (body.status >= 400) {
        callback({ status: body.status, message: body.message })
      }
      else
        _this.requestList(Account, 'GET', [body.account.href]).apply(_this, [function(err, account) {
          callback(err, account)
        }])
    })
  }
  else {
    callback({ status: 1, message: "Must pass in email/password or type/value to verifyAccount" })
  }
}

module.exports = Application
