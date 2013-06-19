'use strict';

var api = require('../lib/const')
  , h = require('../lib/helper')

var should = require('should')

var options = {apiId: "X", apiSecret: "Y"}

describe("Helper", function() {
  describe(".expandHandler", function() {
    it("Should return name", function () {
      h.expandHandler("name").should.equal("name")
    })
    it("Should return name(offset:0, limit:25)", function () {
      h.expandHandler({ name: "name"}).should.equal("name(offset:0, limit:25)")
    })
    it("Should return name(offset:0, limit:25),directories(offset:1, limit:10)", function () {
      h.expandHandler([{ name: "name" }, { name: "directories", offset: 1, limit: 10 }])
        .should
        .equal("name(offset:0, limit:25),directories(offset:1, limit:10)")
    })    
    it("Should return X(offset:0, limit:25),Y(offset:0, limit:25) for 'X,Y'", function () {
      h.expandHandler("X,Y").should.equal("X(offset:0, limit:25),Y(offset:0, limit:25)")
    })
  })
  describe(".plural", function() {
    it("Should return directory->directories", function() {
      h.plural("Directory").should.equal("Directories")
      h.plural("Directory").should.not.equal("Directorys")
      h.plural("Directory").should.not.equal("directories")
      h.plural("Directory").should.not.equal("directorys")
    })
    it("Should return *->*s", function() {
      h.plural("Application").should.equal("Applications")
      h.plural("Application").should.not.equal("Applicatios")
      h.plural("Application").should.not.equal("applications")
      h.plural("application").should.not.equal("Applications")
    })
  })
  describe(".singular", function() {
    it("Should return directories->directory", function() {
      h.singular("Directories").should.equal("Directory")
      h.singular("Directories").should.not.equal("Directorie")
      h.singular("Directories").should.not.equal("directory")
      h.singular("Directories").should.not.equal("directorie")
    })
    it("Should return *->*s", function() {
      h.singular("Applications").should.equal("Application")
      h.singular("Applications").should.not.equal("Applicatio")
      h.singular("Applications").should.not.equal("application")
      h.singular("applications").should.not.equal("Application")
    })
  })
  describe(".titleCase", function() {
    it("Should return titlecase strings, no space support ATM", function() {
      h.titleCase("test").should.equal("Test")
      h.titleCase("test test").should.equal("Test test")
    })
  })
})
