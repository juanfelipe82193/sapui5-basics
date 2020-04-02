// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.TileContainer
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingDialog");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");

    var oClock,
        oLoadingDialog,
        testContainer,
        demiItemData = {
            id : 'testLoadingDialog',
            text : ''
        };

    module("sap.ushell.ui.launchpad.TileContainer", {
        setup: function () {
            sap.ushell.bootstrap("local");
            oLoadingDialog = new sap.ushell.ui.launchpad.LoadingDialog(demiItemData);
            testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
            oLoadingDialog.placeAt('testContainer');
            oClock = sinon.useFakeTimers();
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oClock.restore();
            oLoadingDialog.destroy();
            jQuery(testContainer).remove();
            delete sap.ushell.Container;
        }
    });

    asyncTest("Test Loading dialog animation without interval", function () {
        oLoadingDialog.setLoadAnimationWithInterval(false);
        oLoadingDialog.openLoadingScreen();
        oClock.tick(1);
        start();
        var bFlowerAnimationShown = jQuery.find('.sapUshellLoadingDialogControl:not(.sapUshellVisibilityHidden)').length;

        ok(bFlowerAnimationShown, 'Flower animation should be shown immediately');
    });

    asyncTest("Test Loading dialog animation with interval by default", function () {
        oLoadingDialog.openLoadingScreen();
        oClock.tick(2999);
        start();
        var bFlowerAnimationHidden = jQuery.find('.sapUshellLoadingDialogControl.sapUshellVisibilityHidden').length;

        ok(bFlowerAnimationHidden, 'By default, flower animation should not be shown after 3 secs');
        oClock.tick(3001);
        var bFlowerAnimationShown = jQuery.find('.sapUshellLoadingDialogControl:not(.sapUshellVisibilityHidden)').length;

        ok(bFlowerAnimationShown, 'By default, flower animation should be shown after 3 secs');
    });

    asyncTest("Assure delayed Fiori Flower animation is terminated after closing loading screen", function () {
        oLoadingDialog.openLoadingScreen();
        oLoadingDialog.closeLoadingScreen();
        oClock.tick(3001);
        start();
        var bFlowerAnimationHidden = jQuery.find('.sapUshellLoadingDialogControl.sapUshellVisibilityHidden').length;

        ok(bFlowerAnimationHidden, 'closeLoadingScreen() should terminate the delayed Fiori Flower animation');
    });

    test("Loading Dialog: Popup.open is called in case it is not yet open", function () {
        var oSpyOpen;

        oSpyOpen = sinon.spy(oLoadingDialog._oPopup, "open");
        oLoadingDialog.openLoadingScreen();
        ok(oSpyOpen.called, "open was called");
        oLoadingDialog.closeLoadingScreen();
    });

    test("Loading Dialog: Popup.open is not called in case it is already open", function () {
        var oSpyOpen;

        oLoadingDialog.openLoadingScreen();
        oSpyOpen = sinon.spy(oLoadingDialog._oPopup, "open");
        oLoadingDialog.openLoadingScreen();
        ok(!oSpyOpen.called, "open was not called");
        oLoadingDialog.closeLoadingScreen();
    });
}());
