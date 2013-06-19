'use strict';

// Modified from function `is` found in 
// http://bonsaiden.github.io/JavaScript-Garden/#types.instanceof
// under, "The Class of an Object"
function type(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

function expandHandler(exps) {
  if (type(exps) === 'String') {
    if (!~exps.indexOf(",")) {
      return exps;
    }
    // create an array, continue to exps.map expression
    exps = exps.split(",").map(function(exp) { return { 'name': exp }})
  }
  if (type(exps) === 'Object') { exps = [exps] }
  return exps.map(function(exp) {
    exp.offset = exp.offset || 0
    exp.limit = exp.limit || 25
    if (exp.name) {
      return exp.name + "(offset:" + exp.offset + ", limit:" + exp.limit + ")"
    }
    return ""
  }).join(",")
}
function plural(word) {
  if (word.toLowerCase() === "directory") return word.slice(0, -1) + "ies"
  return word + "s"
}
function singular(word) {
  if (word.toLowerCase() === "directories") return word.slice(0, -3) + "y"
  return word.slice(0, -1)
}

function titleCase(word) {
  return word[0].toUpperCase() + word.slice(1)
}

module.exports.type = type
module.exports.expandHandler = expandHandler
module.exports.titleCase = titleCase
module.exports.plural = plural
module.exports.singular = singular