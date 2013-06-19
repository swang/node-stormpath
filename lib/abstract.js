'use strict';

var request = require('request')
  , qs = require('querystring')

var c = require('./const.js')

// produces a shallow merged copy of b onto a
function merge(a, b) {
  for (var key in b) {
    if (b.hasOwnProperty(key)) {
      a[key] = b[key]
    }
  }
  return a;
}

var Abstract = function() {
  var args = Array.prototype.slice.call(arguments), options

  if (args.length === 1) { options = args[0] }
  if (args.length === 2) { this.setId(args[0]); options = args[1] }

  options = options || {}
  if (options.apiId === null || options.apiSecret === null)
    throw new Error("Please include your Stormpath API ID (apiId) and API Secret (apiSecret)")

  this.req = request.defaults({
    json: options.json ? options.json : true
  })

  this.statusCodes = {}
  this.options = options;

  Object.defineProperty(this, "id", {
    get: function() { return this._id }
  })
  Object.defineProperty(this, "path", {
    get: function() { return this._path }
  })

}

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
Abstract.prototype.update = function(data, callback) {
  if (this.id) {
    this.request('POST', [this.path, this.id], data, function(err, resp, body) {
      if (callback) {
        if (err) return callback(err)
        callback(null, body)
      }
    })
  }
  else
    throw new Error("Cannot update, ID not set")
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

Abstract.prototype.request = function(method, uri) {

  var _this = this, callback, json, options, url, args = Array.prototype.slice.call(arguments)
  
  if (args.length > 2) {
    callback = args.pop()
  }
  if (args.length > 2) {
    json = args.pop()
  }

  url = c.BASE_URL + uri.join('/')
  options = merge(this.options,  { 'method': method, 'uri': url })

  this.req(options, function(err, resp, body) {
    if (err) {
      return callback(new Error(body.message))
    }
    if (resp.statusCode > 300)
      if (_this.statusCodes[resp.statusCode]) {
        return callback(new Error(_this.statusCodes[resp.statusCode].message))
      }
      else {
        return callback(new Error(body.message))
      }
    else {
      return callback(err, resp, body)
    }
  }).auth(options.apiId, options.apiSecret, true)
}

Abstract.prototype.requestList = function(instanceObject, method, uri) {
  var _this = this
  return function() {

    var args = Array.prototype.slice.call(arguments), callback, opts, json, retArray = [];
    if (args.length === 1) { callback = args[0] }
    if (args.length === 2) { opts = args[0]; callback = args[1] }
    if (opts) {
      if (method.toUpperCase() === 'GET') { uri.push("?" + qs.stringify(opts)) }
      else { json = opts }
    }
    _this.request(method, uri, json, function(err, resp, body) {
      if (err) return callback(err)
      body.items.forEach(function(retObj) {
        retArray.push(new instanceObject(_this.options).setData(retObj))
      })
      callback(null, retArray)
    })
  }
}

module.exports = Abstract