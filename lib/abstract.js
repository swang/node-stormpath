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
  Object.defineProperty(this, "path", {
    get: function() { return this._path }
  })

}

util.inherits(Abstract, Client)

Abstract.prototype.extractId = function(url) {
  var valid = (url || "").match(new RegExp("https?:\/\/(.*)\/" + this.path + "\/(.*)\/?","i"))
  if (valid) {
    this.setId(valid[2])
    return this;
  }
  else
    throw new Error("Unable to extract ID from " + url)
}

Abstract.prototype.setPath = function(_path) {
  this._path = _path
  return this
}

Abstract.prototype.setId = function(id) {
  this._id = id
  return this
}

Abstract.prototype.setData = function(data) {
  try { this.extractId(data.href) }
  catch (e) {}

  this.data = data
  return this
}

Abstract.prototype.getData = function(key) {
  return (key ? this.data[key] : this.data)
}

Abstract.prototype.fetch = function(callback) {
  var _this = this;
  console.log(this.path,this.id)
  this.request('GET', [this.path, this.id], function(err, resp, body) {
    if (!err) _this.setData(body)
    callback(err, body)
  })
}

Abstract.prototype.create = function(callback) {
  this.request('POST', this.path, this.getData(), function(err, resp, body) {
    if (callback) {
      if (err) return callback(err)
      callback(null, body)
    }
  })
}

Abstract.prototype.delete = function(callback) {
  if (this.id) {
    this.request('DELETE', [this.path, this.id], function(err, body) {
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