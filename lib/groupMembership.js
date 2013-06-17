'use strict';

var util = require('util')

var Abstract = require('./abstract')

var GroupMembership = function() {
  Abstract.apply(this, arguments)
  this.setPath("groupMemberships")
}

util.inherits(GroupMembership, Abstract)

module.exports = GroupMembership