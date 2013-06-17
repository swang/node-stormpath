'use strict';

var util = require('util')

var Abstract = require('./abstract')

var LoginAttempt = function(options) {
  Abstract.call(this, options)
  this.setPath("loginAttempts")
}

util.inherits(LoginAttempt, Abstract)

module.exports = LoginAttempt