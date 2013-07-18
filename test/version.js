'use strict';

var constants = require('../lib/const')
  , should = require('should')
  , pkg = require('../package.json')


describe("Versioning", function() {
  it("Should return same version in const.js and package.json", function() {
    constants.VERSION.should.equal(pkg.version)
  })
})
