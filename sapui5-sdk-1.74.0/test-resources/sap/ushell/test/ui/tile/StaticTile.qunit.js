// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.tile.StaticTile
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.tile.StaticTile");
    jQuery.sap.require("sap.ushell.resources");

    var demiTileData = {
            //TileBase Constructor arguments
            title : "testTileTitle",
            subtitle : "testTileSubTitle",
            icon : "sap-icon://world",
            info : "testInfo",
            targetURL : "#testTargetUrl"
        },
        oTile,
        testContainer;

    module("sap.ushell.ui.tile.StaticTile", {
        setup: function () {
            oTile = new sap.ushell.ui.tile.StaticTile(demiTileData);
            testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oTile.destroy();
            jQuery(testContainer).remove();
        }
    });

    asyncTest("Render Part - StaticTile wrapping structure Test", function () {
        oTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var bSapUshellStaticTileClassAdded = testContainer.find('.sapUshellStaticTile').length > 0;

            //Check whether a span with sapUshellStaticTile has been created.
            ok(bSapUshellStaticTileClassAdded, "Div with CSS Class: 'sapUshellStaticTile' is added");
        }, 0);
    });

}());