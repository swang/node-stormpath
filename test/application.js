'use strict';
var api = require('../lib/const.js')
  , Client = require('../lib/client.js')
  , Tenant = require('../lib/tenant.js')
  , Application = require('../lib/application.js')
  , nock = require('nock')
  , should = require('should')
  , options = {apiId: "X", apiSecret: "Y"}

describe("Applications", function() {
  before(function () {
    nock(api.API_DOMAIN)
      .defaultReplyHeaders({'Content-Type': 'application/json', 'authorization': "Basic WDpZ"})
      .get('/v1/applications/TEST_APPLICATION_UID/')
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
          "href" : "http://api.stormpath.co/v1/applications/TEST_APPLICATION_UID/passwordResetTokens"
        }
      })
      .get('/v1/applications/TEST_APPLICATION_UID/accounts')
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
      .persist()
      .post('/v1/applications/TEST_APPLICATION_UID/loginAttempts', { type: "basic", value: new Buffer("test@test.com:password").toString('base64') })
      .reply(200, {
        "account": {
          "href": "https://api.stormpath.com/v1/accounts/TEST_LOGINATTEMPT_ACCOUNT_UID"
        }
      })
      .persist()
      .get('/v1/accounts/TEST_LOGINATTEMPT_ACCOUNT_UID')
      .reply(200, {
        "directory": {
            "href": "https://api.stormpath.com/v1/directories/DIR_UID"
        },
        "email": "test@test.com",
        "emailVerificationToken": null,
        "fullName": "TESTER LA_ACCT_SURNAME",
        "givenName": "TESTER",
        "groupMemberships": {
            "href": "https://api.stormpath.com/v1/accounts/GROUP_MEMBERSHIP_UID/groupMemberships"
        },
        "groups": {
            "href": "https://api.stormpath.com/v1/accounts/ACCT_UID/groups"
        },
        "href": "https://api.stormpath.com/v1/accounts/ACCT_UID",
        "middleName": null,
        "status": "ENABLED",
        "surname": "LA_ACCT_SURNAME",
        "tenant": {
            "href": "https://api.stormpath.com/v1/tenants/TEST_TENANT_UID"
        },
        "username": "test@test.com"
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
      t.getGroups(function(err, groups) {
        var group = groups[0]
        groups.length.should.equal(1)

        group.id.should.equal("TEST_GROUP_UID")
        group.getData('directory').href.should.equal(api.BASE_URL + "directories/TEST_APPLICATION_DIRECTORY_UID")
        group.getData('tenant').href.should.equal(api.BASE_URL + "tenants/TEST_TENANT_UID")
        group.getData('accounts').href.should.equal(api.BASE_URL + "groups/TEST_GROUP_UID/accounts")
        group.getData('accountMemberships').href.should.equal(api.BASE_URL + "groups/TEST_GROUP_UID/accountMemberships")
      })
    })
  })
  describe("POST /v1/applications/TEST_APPLICATION_UID/loginAttempts", function() {
    var t = new Application("TEST_APPLICATION_UID", options)
    it("Should return a JSON containing Account resource link", function() {
      t.createLoginAttempt({ type: "basic", value: new Buffer("test@test.com:password").toString('base64') }, function(err, loginAttempt) {
        loginAttempt.getData("account").href.should.equal(api.BASE_URL + "accounts/TEST_LOGINATTEMPT_ACCOUNT_UID")
      })
    })
    it("Should work when making a call from verifyAccounts", function() {
      t.verifyAccount({ email: "test@test.com", password: "password"}, function(err, acct) {
        acct.getData("email").should.equal("test@test.com")
        acct.getData("fullName").should.equal("TESTER LA_ACCT_SURNAME")
      })
    })
  })
})