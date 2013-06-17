'use strict';

var util = require('util')

var Abstract = require('./abstract')

var PasswordResetToken = function() {
  Abstract.apply(this, arguments)
  this.setPath("passwordResetTokens")
}

util.inherits(PasswordResetToken, Abstract)

module.exports = PasswordResetToken