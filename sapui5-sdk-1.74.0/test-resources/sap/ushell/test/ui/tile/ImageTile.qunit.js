// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.tile.ImageTile
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.tile.ImageTile");
    jQuery.sap.require("sap.ushell.resources");

    var demiTileData = {
            //TileBase Constructor arguments
            title : "testTileTitle",
            subtitle : "testTileSubTitle",
            icon : "sap-icon://world",
            info : "testInfo",
            targetURL : "#testTargetUrl",
            imageSource: 'test'
        },
        oTile,
        testContainer;

    module("sap.ushell.ui.tile.ImageTile", {
        setup: function () {
            oTile = new sap.ushell.ui.tile.ImageTile(demiTileData);
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

    test("Constructor Test", function () {
        deepEqual(oTile.getImageSource(), demiTileData.imageSource, "Image Source property test");
    });

    asyncTest("Render Part - ImageTile wrapping structure Test", function () {
        var sSource = "/ushell/resources/sap/ushell/themes/base/img/grid.png";
        oTile.setImageSource(sSource);
        oTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var bSapUshellImageTileClassAdded = testContainer.find('.sapUshellImageTile').length > 0,
                sImageSrc = testContainer.find('.sapUshellImageTile').attr('src');

            //Check whether a span with sapUshellImageTile has been created.
            ok(bSapUshellImageTileClassAdded, "Div with CSS Class: 'sapUshellImageTile' is added");
            deepEqual(sImageSrc, sSource, "Image src is the same as configured");
        }, 0);
    });

}());