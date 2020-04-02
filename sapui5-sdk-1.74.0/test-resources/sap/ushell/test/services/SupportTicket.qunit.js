// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.SupportTicket and customizable
 * extensions
 */
sap.ui.require([
    "sap/ushell/services/SupportTicket",
    "sap/ushell/test/utils"
], function (SupportTicket, testUtils) {
    "use strict";
    /*global equal, module,
      test,
      jQuery, sap, window */
    jQuery.sap.require("sap.ushell.services.Container");
    module(
        "sap.ushell.services.SupportTicket",
        {
            setup : function () {
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                jQuery.sap.getObject("sap-ushell-config.services.SupportTicket.config", 0).enabled = false;
                delete sap.ushell.Container;
            }
        }
    );

    test("service disabled by default - factory instantiation", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.getServiceAsync("SupportTicket").then(function (oService) {
                equal(oService.isEnabled(), false);
                done();
            });
        });
    });

    test("service disabled by default - constructor call", function () {
        var oService = new SupportTicket();

        equal(oService.isEnabled(), false);
    });

    test("service enabled if set in bootstrap config", function (assert) {
        var done = assert.async();
        var oUshellConfig = testUtils.overrideObject({}, {
                "/services/SupportTicket/config/enabled": true
            });
        testUtils.resetConfigChannel(oUshellConfig);

        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.getServiceAsync("SupportTicket").then(function (oService) {
                equal(oService.isEnabled(), true);
                done();
            });
        });
    });

    test("service disabled if set in bootstrap config", function (assert) {
        var done = assert.async();
        var oUshellConfig = testUtils.overrideObject({}, {
                "/services/SupportTicket/config/enabled": false
            });
        testUtils.resetConfigChannel(oUshellConfig);

        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.getServiceAsync("SupportTicket").then(function (oService) {
                equal(oService.isEnabled(), false);
                done();
            });
        });
    });

});
