'use strict';

var util = require('util')

var Abstract = require('./abstract')

var LoginAttempt = function() {
  Abstract.apply(this, arguments)
  this.setPath("loginAttempts")
}

util.inherits(LoginAttempt, Abstract)

module.exports = LoginAttempt