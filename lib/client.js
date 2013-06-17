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

var Client = function(options) {
  options = options || {}
  if (options.apiId === null && options.apiSecret === null)
    throw new Error("Please include your Stormpath API ID (apiId) and API Secret (apiSecret)")

  this.req = request.defaults({
    json: options.json ? options.json : true
  })

  this.statusCodes = {}
  this.options = options;
}

Client.prototype.request = function(method, uri) {

  var _this = this, callback, json, options, url, args = Array.prototype.slice.call(arguments)
  
  if (args.length > 2) {
    callback = args.pop()
  }
  if (args.length > 2) {
    json = args.pop()
  }

  url = c.BASE_URL + uri.join('/')
  options = merge(this.options,  { 'method': method, 'uri': url })

  if (json) {
    try {
      options.body = JSON.parse(json)
    }
    catch (e) {
      options.body = json
    }
  }

  this.req(options, function(err, resp, body) {
    if (err) {
      return callback(new Error(body.message))
    }
    if (resp.statusCode > 300)
      if (_this.statusCodes[resp.statusCode])
        return callback(new Error(_this.statusCodes[resp.statusCode]))
      else {
        return callback(new Error(body.message))
      }
    else
      return callback(err, resp, body)
  }).auth(options.apiId, options.apiSecret, true)
}

Client.prototype.requestList = function(instanceObject, method, uri) {
  var _this = this
  return function() {

    var args = Array.prototype.slice.call(arguments), callback, opts, json, retArray;
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

module.exports = Client