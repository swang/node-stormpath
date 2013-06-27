'use strict';

var request = require('request')
  , qs = require('querystring')

var c = require('./const')
  , h = require('./helper')

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
  this.expanded = {}
  this.options = options;

  Object.defineProperty(this, "id", {
    get: function() { return this._id }
  })
  Object.defineProperty(this, "path", {
    get: function() { return this._path }
  })
  Object.defineProperty(this, "req", {
    "enumerable": false
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
  this.request('POST', [this.path], this.getData(), function(err, resp, body) {
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
    callback({ status: 1, message: "Cannot update, ID not set" })
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
    callback({ status: 1, message: "Cannot delete, ID not set" })
}
Abstract.prototype._setResource = function(resource, items, callback) {
  var retArray = [], _this = this
  items.forEach(function(item) {
    retArray.push(new global[h.singular(resource)](_this.options).setData(item))
  })
  _this.expanded[resource] = retArray
  if (callback) { callback(null, retArray) }
}

Abstract.prototype.request = function(method, uri) {
  var _this = this, callback, json, options, url, args = Array.prototype.slice.call(arguments), uriJoin
  
  if (args.length == 4) {
    callback = args.pop()
    json = args.pop()
  }
  if (args.length == 3) {
    callback = args.pop()
  }
  if (method.toUpperCase() === 'GET' && json) {

    uri.push("?" + qs.stringify(json))
  }
  uriJoin = uri.join('/')
  url = (uriJoin.indexOf('://') === -1 ? c.BASE_URL : "") + uriJoin
  options = merge(this.options,  { 'method': method, 'url': url, 'body': json } )
  this.req(options, function(err, resp, body) {
    if (err) { return callback(err) }

    if (body.status >= 400) {
      if (_this.statusCodes && _this.statusCodes[body.status]) {
        return callback({ status: body.status, message: _this.statusCodes[body.status].message })
      }
      else {
        return callback({ status: body.status, message: body.message })
      }
    }
    return callback(err, resp, body)
  }).auth(options.apiId, options.apiSecret, true)
}

Abstract.prototype.requestList = function(instanceObject, method, uri) {
  var _this = this
  return function() {

    var args = Array.prototype.slice.call(arguments), callback, opts, json, retArray = [];
    if (args.length === 1) { callback = args[0] }
    if (args.length === 2) { opts = args[0]; callback = args[1] }
    if (opts) {
      if (method.toUpperCase() === 'GET') {
        if (opts.expand) { this._expand = opts.expand; opts.expand = h.expandHandler(opts.expand) || "" }
        uri.push("?" + qs.stringify(opts))
      }
      else { json = opts }
    }
    _this.request(method, uri, json, function(err, resp, body) {
      var expands, retResources = []

      if (err) return callback(err)

      if (opts && _this._expand) {
        expands = _this._expand.split(",")
        expands.forEach(function(resource) {
          var expandClass = require('./' + h.singular(resource))
          if (body[resource] && body[resource].items) {
            var resSingle = []
            body[resource].items.forEach(function(resItem) {
              resSingle.push(new expandClass(_this.options).setData(resItem))
            })
            retResources.push(resSingle)
          }
        })
      }
      if (body.items) {
        body.items.forEach(function(retObj) {
          retArray.push(new instanceObject(_this.options).setData(retObj))
        })
        return callback.apply(_this, [null, retArray].concat(retResources))
      }
      else {
        return callback.apply(_this, [null, new instanceObject(_this.options).setData(body)].concat(retResources))
      }

    })
  }
}
module.exports = Abstract