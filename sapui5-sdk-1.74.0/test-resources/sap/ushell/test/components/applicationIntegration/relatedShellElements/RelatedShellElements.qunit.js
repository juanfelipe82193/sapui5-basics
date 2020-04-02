// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.AppLifeCyclejs
 */
sap.ui.require([
    "sap/ushell/components/applicationIntegration/relatedShellElements/RelatedShellElements",
    "sap/ushell/test/utils",
    "sap/ushell/services/Container",
    "sap/ushell/Config"
], function (RelatedShellElements, utils, Container, Config) {
    "use strict";
    /* global equal deepEqual module ok stop test jQuery sap QUnit sinon asyncTest start */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.renderers.fiori2.History");
    jQuery.sap.require("sap.ushell.renderers.fiori2.Renderer");
    jQuery.sap.require("sap.ui.thirdparty.datajs");
    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingDialog");
    jQuery.sap.require("sap.ushell.components.applicationIntegration.AppLifeCycle");
    jQuery.sap.require("sap.ushell.EventHub");

    //jQuery.sap.require("sap.ushell.components.applicationIntegration.AppLifeCycle");
    var oAppModel;

    module("sap.ushell.components.applicationIntegration.relatedService.RelatedServices", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        setup: function () {
            var shellModelMock = {
                _renderShellState: function () {

                }
            };

            RelatedShellElements.init(shellModelMock);
            oAppModel = RelatedShellElements.model();
        },

        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            RelatedShellElements.clean();
            oAppModel = undefined;

        }
    });

    QUnit.test("#basic test", function (assert) {
        [
            {
                backImpl: function () {

                },
                reset: false,
                defaultCallCount: 0,
                description: "Set back implementation expect no defaule back call counts",
                oViewPortContainer: null
            }
        ].forEach(function (oFixture) {
            RelatedShellElements.addShellModelForApplications ("actions", ["testbt1", "testbt2"], true);
            var oAppRelatedShellModel = RelatedShellElements.getStateModelToUpdate();

            assert.strictEqual(oAppRelatedShellModel.currentState.actions.indexOf("testbt1"), 0, "testbt1 is first object");
            assert.strictEqual(oAppRelatedShellModel.currentState.actions.indexOf("testbt2"), 1, "testbt2 is sec object");
            assert.strictEqual(oAppRelatedShellModel.currentState.actions.indexOf("testbt3"), -1, "testbt3 is not third");

            RelatedShellElements.addShellModelForApplications ("actions", ["testbt3"], true);
            assert.strictEqual(oAppRelatedShellModel.currentState.actions.indexOf("testbt3"), 0, "testbt3 is no #0");
            assert.strictEqual(oAppRelatedShellModel.currentState.actions.indexOf("testbt1"), 1, "testbt1 is #1");
            assert.strictEqual(oAppRelatedShellModel.currentState.actions.indexOf("testbt2"), 2, "testbt2 is #3");

            //    var oServiceInstance;
        //
        //    var historyBackNavigationStub = sinon.stub(RelatedServices, "_historyBackNavigation");
        //
        //    AppLifeCycle.init("home", oFixture.oViewPortContainer, "Shell-home", false, {
        //        ownerComponent: "test"
        //    });
        //    oServiceInstance = AppLifeCycle.service();
        //
        //    oServiceInstance.create();
        //
        //    if (oFixture.backImpl) {
        //        oServiceInstance.setNavigateBack(oFixture.backImpl);
        //    }
        //
        //    oServiceInstance.navigateBack();
        //
        //    assert.strictEqual(historyBackNavigationStub.callCount, oFixture.defaultCallCount, oFixture.description);
        //
        //    if (oFixture.reset) {
        //        oServiceInstance.resetNavigateBack();
        //        oServiceInstance.navigateBack();
        //        assert.strictEqual(historyBackNavigationStub.callCount, oFixture.defaultCallCountAfterReset, oFixture.description + ":After Reset");
        //    }
        //    historyBackNavigationStub.restore();
        });
    });
/*

    QUnit.test("#back navigation with store restore", function (assert) {
        var oServiceInstance;

        var historyBackNavigationStub = sinon.stub(RelatedServices, "_historyBackNavigation");

        AppLifeCycle.init("home", null, "Shell-home", false, {
            ownerComponent: "test"
        });
        oServiceInstance = AppLifeCycle.service();

        var oServiceDataI = oServiceInstance.create();

        oServiceInstance.navigateBack();

        assert.strictEqual(historyBackNavigationStub.callCount, 1, "default implementation create");

        historyBackNavigationStub.reset();

        var oServiceDataII = oServiceInstance.create();

        oServiceInstance.setNavigateBack(function () {

        });

        assert.strictEqual(historyBackNavigationStub.callCount, 0, "setNavigation create");

        historyBackNavigationStub.reset();

        // restore default
        oServiceInstance.restore(oServiceDataI);
        oServiceInstance.navigateBack();

        assert.strictEqual(historyBackNavigationStub.callCount, 1, "default implementation restore");

        historyBackNavigationStub.reset();

        // restore setBackNavigation
        oServiceInstance.restore(oServiceDataII);
        oServiceInstance.navigateBack();

        assert.strictEqual(historyBackNavigationStub.callCount, 0, "setBackNavigation restore");

        historyBackNavigationStub.restore();
    });*/
});
