'use strict';

var util = require('util')

var Abstract = require('./abstract')

var EmailVerificationToken = function() {
  Abstract.apply(this, arguments)
  this.setPath("accounts/emailVerificationTokens")
}

util.inherits(EmailVerificationToken, Abstract)

module.exports = EmailVerificationToken

EmailVerificationToken.prototype.post = function(callback) {
  this.request('POST', [this.path, this.id], callback)
}
