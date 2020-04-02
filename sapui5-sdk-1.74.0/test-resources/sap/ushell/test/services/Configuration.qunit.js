// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.Configuration
 */
sap.ui.require([
    "sap/ushell/services/Configuration",
    "sap/ushell/Config",
    "sap/ushell/test/utils"
], function (Configuration, Config, testUtils) {
    "use strict";
    /*global Promise module
      stop test dispatchEvent document jQuery
      sap setTimeout sinon Storage window */

    module("sap.ushell.services.Configuration", {
        setup: function () {


        },
        teardown: function () {

        }
    });

    test("attachSizeBehaviorUpdate delivers initial value", function (assert) {
        var fnDone = assert.async(),
            oService = new Configuration(),
            oCallback = sinon.spy(),
            oDoable = oService.attachSizeBehaviorUpdate(oCallback);
        Config.once("/core/home/sizeBehavior").do( function () {
            assert.ok(oCallback.calledOnce);
            assert.ok(oCallback.calledWith("Responsive"));
            oDoable.detach();
            fnDone();
        });
    });

    test("attachSizeBehaviorUpdate calls callback", function (assert) {
        var fnDone = assert.async(),
            oService = new Configuration(),
            oCallback = sinon.spy(),
            oDoable = oService.attachSizeBehaviorUpdate(oCallback);
        Config.emit("/core/home/sizeBehavior", "Small");
        Config.once("/core/home/sizeBehavior").do( function () {
            assert.ok(oCallback.calledTwice);
            assert.equal("Small", oCallback.secondCall.args[0]);
            oDoable.detach();
            fnDone();
        });
    });

    test("attachSizeBehaviorUpdate return detach object that detaches", function (assert) {
        var fnDone = assert.async(),
            oService = new Configuration(),
            oCallback = sinon.spy(),
            oDoable = oService.attachSizeBehaviorUpdate(oCallback);

        oDoable.detach();
        Config.emit("/core/home/sizeBehavior", "Responsive");
        Config.once("/core/home/sizeBehavior").do( function () {
            assert.ok(oCallback.calledOnce);
            fnDone();
        });
    });

});