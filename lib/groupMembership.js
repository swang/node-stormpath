'use strict';

var util = require('util')

var Abstract = require('./abstract')

var GroupMembership = function(options) {
  Abstract.call(this, options)
  this.setPath("groupMemberships")
}

util.inherits(GroupMembership, Abstract)

module.exports = GroupMembership