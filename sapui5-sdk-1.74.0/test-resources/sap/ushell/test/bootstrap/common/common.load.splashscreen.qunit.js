// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for common.load.splashscreen
 */
sap.ui.require([
    "sap/ushell/bootstrap/common/common.load.splashscreen"
], function (fnLoadSplashscreen) {

    /* global QUnit jQuery */
    "use strict";

    var BOOT_PATH = "/sap/bc/ui5_ui5/ui2/ushell/resources";

    QUnit.module("common.load.splashscreen", {
        setup: function () {
        },
        teardown: function () {
        }
    });

    QUnit.test("Load splashscreen", function (assert) {
        var fnDone = assert.async();
        var aResult, bAllHrefStartWithBootPath = true;

        // act
        fnLoadSplashscreen(BOOT_PATH);

        setTimeout(function () {
            // assert
            aResult = jQuery("link[rel=apple-touch-startup-image]");
            assert.equal(aResult.length, 7, "Should be 7 links with rel=apple-touch-startup-image");
            aResult.each(function (sKey, oLink) {
                if (!jQuery(oLink).attr("href").startsWith(BOOT_PATH)) {
                    bAllHrefStartWithBootPath = false;
                }
            });
            assert.ok(bAllHrefStartWithBootPath, "All hrefs in the link should start with boot path");
            fnDone();
        }, 100);

    });

});
