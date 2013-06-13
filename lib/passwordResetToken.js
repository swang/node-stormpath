'use strict';

var util = require('util')

var Abstract = require('./abstract')

var PasswordResetToken = function(options) {
  Abstract.call(this, options)
  this.setPath("passwordResetToken")
}

util.inherits(PasswordResetToken, Abstract)

module.exports = PasswordResetToken