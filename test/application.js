'use strict';

var api = require('../lib/const.js');
var Client = require('../lib/client.js');
var Tenant = require('../lib/tenant.js');
var Application = require('../lib/application.js');

var nock = require('nock')
  , should = require('should')

var options = {apiId: "X", apiSecret: "Y"}

describe("Applications", function() {
  before(function () {
    nock(api.API_DOMAIN)
      .defaultReplyHeaders({'Content-Type': 'application/json'})
      .get('/v1/applications/TEST_APPLICATION_UID/')
      .matchHeader('authorization', "Basic WDpZ")
      .reply(200, {
        "href": "https://api.stormpath.com/v1/applications/TEST_APPLICATION_UID",
        "name": "Best application ever",
        "description": "Really. The best application ever.",
        "status": "enabled",
        "accounts": {
          "href": "https://api.stormpath.com/v1/applications/TEST_APPLICATION_UID/accounts"
        },
        "tenant": {
          "href": "https://api.stormpath.com/v1/tenants/TEST_TENAND_UID"
        },
        "passwordResetTokens" : {
          "href" : "http://localhost:8080/v1/applications/TEST_APPLICATION_UID/passwordResetTokens"
        }
      })
      .get('/v1/applications/TEST_APPLICATION_UID/accounts')
      .matchHeader('authorization', "Basic WDpZ")
      .reply(200, {
        "href": "https://api.stormpath.com/v1/applications/TEST_APPLICATION_UID/accounts",
        "offset": 0,
        "limit": 25,
        "items":
          [{ 
            "href" : "https://api.stormpath.com/v1/accounts/TEST_ACCOUNT_UID_1"
          },
          {
            "href" : "https://api.stormpath.com/v1/accounts/TEST_ACCOUNT_UID_2"
          }, 
          {
            "href" : "https://api.stormpath.com/v1/accounts/TEST_ACCOUNT_UID_3"
          }]
      })
      .get('/v1/applications/TEST_APPLICATION_UID/groups')
      .matchHeader('authorization', "Basic WDpZ")
      .reply(200, {
        "href": "https://api.stormpath.com/v1/applications/TEST_APPLICATION_UID/groups",
        "offset": 0,
        "limit": 25,
        "items": [{
          "href": "https://api.stormpath.com/v1/groups/TEST_GROUP_UID",
          "name": "Group Alpha",
          "description": "Group Alpha",
          "status": "ENABLED",
          "directory": {
            "href": "https://api.stormpath.com/v1/directories/TEST_APPLICATION_DIRECTORY_UID"
          },
          "tenant": {
            "href": "https://api.stormpath.com/v1/tenants/TEST_TENANT_UID"
          },
          "accounts": {
            "href": "https://api.stormpath.com/v1/groups/TEST_GROUP_UID/accounts"
          },
          "accountMemberships": {
            "href": "https://api.stormpath.com/v1/groups/TEST_GROUP_UID/accountMemberships"
          }
        }]
      })
  })
  describe("GET /v1/applications/TEST_APPLICATION_UID/", function() {
    var t = new Application("TEST_APPLICATION_UID", options)
    it("Should return the three accounts in Application", function() {
      
      t.getAccounts(function(err, accts) {
        accts.length.should.equal(3)
        accts[0].id.should.equal("TEST_ACCOUNT_UID_1")
        accts[1].id.should.equal("TEST_ACCOUNT_UID_2")
        accts[2].id.should.equal("TEST_ACCOUNT_UID_3")
      })
    })

    it("Should return the one group in Application", function() {
      var t = new Application("TEST_APPLICATION_UID", options)
      t.getGroups(function(err, groups) {
        groups.length.should.equal(1)
        groups[0].id.should.equal("TEST_GROUP_UID")
        groups[0].getData('directory').href.should.equal("https://api.stormpath.com/v1/directories/TEST_APPLICATION_DIRECTORY_UID")
        groups[0].getData('tenant').href.should.equal("https://api.stormpath.com/v1/tenants/TEST_TENANT_UID")
        groups[0].getData('accounts').href.should.equal("https://api.stormpath.com/v1/groups/TEST_GROUP_UID/accounts")
        groups[0].getData('accountMemberships').href.should.equal("https://api.stormpath.com/v1/groups/TEST_GROUP_UID/accountMemberships")
      })
    })

  })
})