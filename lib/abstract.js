'use strict';

var util = require('util')

var Client = require('./client')

var Abstract = function() {
  var args = Array.prototype.slice.call(arguments), options
  if (args.length === 1) { options = args[0] }
  if (args.length === 2) { this.setId(args[0]); options = args[1] }

  Client.call(this, options)

  Object.defineProperty(this, "id", {
    get: function() { return this._id }
  })
}
util.inherits(Abstract, Client)

Abstract.prototype.extractId = function(url) {
  var valid = (url || "").match(new RegExp("https?:\/\/(.*)\/" + this.getPath() + "\/(.*)\/?","i"))
  if (valid) {
    this.setId(valid[2])
    return this;
  }
  else
    throw new Error("Unable to extract ID from " + url)
}

Abstract.prototype.setPath = function(path) {
  this.path = path
  return this
}

Abstract.prototype.getPath = function() {
  return this.path
}

Object.defineProperty(Abstract.prototype, "id", {
  get: function() { return this._id }
})

Abstract.prototype.setId = function(id) {
  this._id = id
  return this
}

Abstract.prototype.setData = function(data) {
  this.data = data
  return this
}

Abstract.prototype.getData = function(key) {
  return (key ? this.data[key] : this.data)
}

Abstract.prototype.create = function(callback) {
  this.request('POST', [this.getPath()], this.getData(), function(err, resp, body) {
    if (callback) {
      if (err) return callback(err)
      callback(null, body)
    }
  })
}

Abstract.prototype.delete = function(callback) {
  if (this.id) {
    this.request('DELETE', [this.getPath(), this.id], function(err, body) {
      if (callback) {
        if (err) return callback(err)
        callback(null, body)
      }
    })
  }
  else
    throw new Error("Cannot delete, ID not set")
}

module.exports = Abstract