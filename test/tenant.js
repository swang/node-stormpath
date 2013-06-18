'use strict';

var api = require('../lib/const.js');
var Client = require('../lib/client.js');

var nock = require('nock')
  , should = require('should')

describe("Tenants", function() {
  before(function () {
    nock(api.API_DOMAIN)
      
      .matchHeader('authorization', "Basic WDpZ")
      .defaultReplyHeaders({'Content-Type': 'application/json'})
      .get('/v1/tenants/current')
      .reply(200, {
        "href": "https://api.stormpath.com/v1/tenants/TEST_TENANT_UID",
        "name": "TEST_TENANT_NAME",
        "key": "TEST_TENANT_NAME",
        "applications": {
          "href": "https://api.stormpath.com/v1/tenants/TEST_TENANT_UID/applications"
        },
        "directories": {
          "href": "https://api.stormpath.com/v1/tenants/TEST_TENANT_UID/directories"
        }
      })
  })
  describe("GET /v1/tenants/current", function() {
    it("Should return the current Tenant object", function() {
      var c = new Client({apiId: "X", apiSecret: "Y"})
      c.getCurrentTenant(function(err, tenant) {
        tenant.id.should.equal("TEST_TENANT_UID")
        tenant.getData('href').should.equal("https://api.stormpath.com/v1/tenants/TEST_TENANT_UID")
        tenant.getData('name').should.equal("TEST_TENANT_NAME")
        tenant.getData('key').should.equal("TEST_TENANT_NAME")
        tenant.getData('applications').href.should.equal("https://api.stormpath.com/v1/tenants/TEST_TENANT_UID/applications")
        tenant.getData('directories').href.should.equal("https://api.stormpath.com/v1/tenants/TEST_TENANT_UID/directories")
      })
    })
  })
})




