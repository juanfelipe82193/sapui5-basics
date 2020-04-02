// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.tiles.utilsRT.js
 */
(function () {
    "use strict";
    /*global equal, module, assert, ok, stop, test, jQuery, sap, sinon, start */

    jQuery.sap.require("sap.ushell.components.tiles.utilsRT");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.m.Input");
    jQuery.sap.require("sap.m.Label");
    jQuery.sap.require("sap.ushell.ui.launchpad.Tile");
    jQuery.sap.require("sap.ushell.services.AppConfiguration");
    jQuery.sap.require("sap.ushell.components.tiles.utils");

    module("sap.ushell.components.tiles.utilsRT", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(start);
        },

        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    test("check addParamsToUrl()", function () {
        var data = {};
        data.targetParams = ['query=mondial'];

        var sURL = sap.ushell.components.tiles.utilsRT.addParamsToUrl('http://www.google.com', data);
        equal(sURL, 'http://www.google.com?query=mondial', "Test 6.1: URL parameters were added");

        //Test URL that already had a query parameter
        data.targetParams = ['team=Brazil'];
        var sURL = sap.ushell.components.tiles.utilsRT.addParamsToUrl(sURL, data);
        equal(sURL, 'http://www.google.com?query=mondial&team=Brazil', "Test 6.2: URL parameters were added");
    });

    test("check default formatting number", function () {
        var oUtils = sap.ushell.components.tiles.utilsRT;
        var fnNormalizeSpy = sinon.spy(oUtils, "_normalizeNumber");
        var fnFormatNumberTestHelpper = function (maxCharactersInDisplayNumber, bCalled, bProccessDigits, oConfig, oDynamicData) {
            var fnProccessDigitStub = sinon.stub(oUtils, "_shouldProcessDigits").returns(bProccessDigits);

            oUtils.getDataToDisplay(oConfig, oDynamicData);
            ok(fnNormalizeSpy.calledOnce === bCalled, bCalled ? "normalizeNumber is expected to be called once" : "normalizeNumber isn't expected to be called once");
            if (bCalled) {
                ok(fnNormalizeSpy.args[0][1] === maxCharactersInDisplayNumber, "When the tile contains icon, the maximum allowed digits is: 4, otherwise: 5");
            }

            fnNormalizeSpy.reset();
            fnProccessDigitStub.restore();
        };

        fnFormatNumberTestHelpper(4, true, false, {display_icon_url: 'test'}, {number: '12345'});
        fnFormatNumberTestHelpper(5, true, false, {display_icon_url: undefined}, {number: '123456'});
        fnFormatNumberTestHelpper(5, true, true, {display_icon_url: undefined}, {number: '123'});
        fnFormatNumberTestHelpper(4, false, false, {display_icon_url: 'test'}, {number: '123'});
    });

    test("Test edge case formatting", function () {
        var oUtils = sap.ushell.components.tiles.utilsRT,
            oConfig = {},
            oDynamicData = {number: "17142", numberDigits: "0"},
            oData = oUtils.getDataToDisplay(oConfig, oDynamicData);
        ok(oData.display_number_value === "17");
        ok(oData.display_number_unit === "");
        ok(oData.display_icon_url === "");
        ok(oData.display_title_text === "");
        ok(oData.display_number_unit === "");
        ok(oData.display_info_text === "");
        ok(oData.display_info_state === "Neutral");
        ok(oData.display_subtitle_text === "");
        ok(oData.display_state_arrow === "None");
        ok(oData.display_number_digits === "0");
        ok(oData.display_number_factor === "K");
        ok(oData.display_search_keyword === "");

    });

    test("check normalizing number", function () {
        var oUtils = sap.ushell.components.tiles.utilsRT,
            oNormalizedNum;

        oNormalizedNum = oUtils._normalizeNumber("Not_a_Number", 5);
        ok(oNormalizedNum.displayNumber === "Not_a", "Test normalizing number when the string value is NaN and the allowed number of digit is 5");
        oNormalizedNum = oUtils._normalizeNumber("123456", 5);
        ok(oNormalizedNum.displayNumber === "123.4", "Test normalizing number when the Number value is larger than the maxamial alowed amount of digits");
        ok(oNormalizedNum.numberFactor === "K", "Test normalizing number when number is: '1000000 > number > 999'");
        oNormalizedNum = oUtils._normalizeNumber("1234567", 5);
        ok(oNormalizedNum.displayNumber === "1.234", "Test normalizing number when the Number value is larger than the maxamial alowed amount of digits");
        ok(oNormalizedNum.numberFactor === "M", "Test normalizing number when number is: '1000000000 > number > 999999'");
        oNormalizedNum = oUtils._normalizeNumber("1234567890", 5);
        ok(oNormalizedNum.displayNumber === "1.234", "Test normalizing number when the Number value is larger than the maxamial alowed amount of digits");
        ok(oNormalizedNum.numberFactor === "B", "Test normalizing number when number is: '10000000000 > number > 999999999'");
        oNormalizedNum = oUtils._normalizeNumber("123", 5, 'TEST');
        ok(oNormalizedNum.numberFactor === "TEST", "Test normalizing number when the Number Factor is predifined");
        oNormalizedNum = oUtils._normalizeNumber("12345.5", 3);
        ok(oNormalizedNum.displayNumber === "12", "Test normalizing number - Assure that if the last carachter after formatting is '.' , it's being truncated");
    });

    test("check should process digits", function () {
        var oUtils = sap.ushell.components.tiles.utilsRT,
            bShouldProcessDigits;

        bShouldProcessDigits = oUtils._shouldProcessDigits("1234");
        ok(!bShouldProcessDigits, "_shouldProcessDigits should be falsy when the Display Number doesn't contain a decimal point");
        bShouldProcessDigits = oUtils._shouldProcessDigits("12.34", 1);
        ok(bShouldProcessDigits, "_shouldProcessDigits should be truthy when the number of tenths is greater the number of digits to display");
        bShouldProcessDigits = oUtils._shouldProcessDigits(12.34, 1);
        ok(bShouldProcessDigits, "_shouldProcessDigits should handle non string (number) values for the  argument: sDisplayNumber");
    });

    test("getConfiguration with corrupted JSON data", function () {
        var oUtilsRT = sap.ushell.components.tiles.utilsRT;

        var oTileApi = {
                "__metadata": {
                    "type": "PAGE_BUILDER_PERS.PageChipInstance"
                },
                "pageId": "/UI2/Fiori2LaunchpadHome",
                "instanceId": "008MEOP2VK3O2VC0PQSOGC629",
                "chipId": "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
                "title": "Sales Order",
                "configuration": {
                    getParameterValueAsString: function () {
                        return "{\"tileConfiguration\":\"{\\\"display_icon_url_CORRUPT_HERE__\r__END_OF_CORRUPTION\\\":\\\"sap-icon://Fiori2/F0020\\\",\\\"display_info_text\\\":\\\"Test\\\",\\\"display_subtitle_text\\\":\\\"Venkat - SO\\\",\\\"display_title_text\\\":\\\"Sales Order\\\",\\\"navigation_target_url\\\":\\\"#SalesOrder-change&/detail/SalesOrders('32594')\\\",\\\"navigation_use_semantic_object\\\":false}\"}";
                    }
                },
                "layoutData": "",
                "remoteCatalogId": "",
                "referencePageId": "",
                "referenceChipInstanceId": "",
                "isReadOnly": "",
                "scope": "PERSONALIZATION",
                "updated": "\/Date(1396496357000)\/",
                "outdated": "",
                "Chip": {
                    "__metadata": {
                        "type": "PAGE_BUILDER_PERS.Chip"
                    },
                    "id": "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
                    "title": {
                        getTitle: function () {
                            return "App Launcher – Static";
                        }
                    },
                    "description": "Displays static text and icons that can be configured",
                    "configuration": "",
                    "url": "/sap/bc/ui5_ui5/ui2/ushell/chips/applauncher.chip.xml",
                    "baseChipId": "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
                    "catalogId": "/UI2/CATALOG_ALL",
                    "catalogPageChipInstanceId": "",
                    "referenceChipId": "",
                    "isReadOnly": "",
                    "Catalog": {
                        "__deferred": {
                        }
                    },
                    "ReferenceChip": {
                        "__deferred": {
                        }
                    },
                    "ChipBags": {
                        "results": []
                    },
                    "CatalogPageChipInstance": {
                        "__deferred": {
                        }
                    }
                },
                "ReferenceChip": {
                    "__deferred": {
                    }
                },
                "RemoteCatalog": null,
                "ReferenceChipInstance": {
                    "__deferred": {
                    }
                },
                "ChipInstanceBags": {
                    "results": []
                }
            },
            bAdmin = false,
            bEdit = false;

        var oUtils = sap.ushell.components.tiles.utils;
        sinon.stub(oUtils, "getTranslatedTitle", function () {
             return "Translated Title";
        });
        sinon.stub(oUtils, "getTranslatedSubtitle", function () {
            return "Translated Subtitle";
        });
        sinon.stub(oUtils, "getTranslatedProperty", function () {
            return "Translated Property";
        });
        sinon.stub(oUtils, "getTileNavigationActions", function () {
            return "Tile Navigation Actions";
        });

        var result = oUtilsRT.getConfiguration(oTileApi, bAdmin, bEdit);
        var expected = {}; // should return an empty object when the configuration is corrupted

        assert.deepEqual(result, expected, "getConfiguration passed even when configuration is corrupted");

    });

    test("getTileSettingsAction for tile", function (assert) {
        var oUtilsRT = sap.ushell.components.tiles.utilsRT,
            done = assert.async();

        var getMetadataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata").returns({icon: "icon"});

        var oModel = new sap.ui.model.json.JSONModel({
            config : {
                display_title_text : "Tile title",
                display_subtitle_text: "Tile subtitle",
                display_info_text: "Tile information",
                display_icon_url: undefined,
                display_search_keywords: undefined
            }
        });

        var tileSettingsAction = oUtilsRT.getTileSettingsAction(oModel, function () {}, "tile");

        assert.ok(tileSettingsAction, "Action was created");

        tileSettingsAction.press();
        setTimeout(function() {
            var tileSettingsDialog = sap.ui.getCore().byId('settingsDialog');
            tileSettingsDialog.close();

            var saveAsTileView = tileSettingsDialog.getContent()[0].getContent()[0];
            assert.equal(saveAsTileView.oTitleInput.getProperty("value"), "Tile title");
            assert.equal(saveAsTileView.oSubTitleInput.getProperty("value"), "Tile subtitle");
            assert.equal(saveAsTileView.oInfoInput.getProperty("value"), "Tile information");
            assert.equal(saveAsTileView.oGroupsSelect.getProperty("visible"), false);

            getMetadataStub.restore();
            tileSettingsDialog.destroy();
            done();
        }, 100);

    });

    test("getTileSettingsAction for link", function (assert) {
        var oUtilsRT = sap.ushell.components.tiles.utilsRT,
            done = assert.async();

        var getMetadataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata").returns({icon: "icon"});

        var oModel = new sap.ui.model.json.JSONModel({
            config : {
                display_title_text : "Link title",
                display_subtitle_text: "Link subtitle"
            }
        });

        var tileSettingsAction = oUtilsRT.getTileSettingsAction(oModel, function () {}, "link");

        assert.ok(tileSettingsAction, "Action was created");

        tileSettingsAction.press();
        setTimeout(function () {
            var linkSettingsDialog = sap.ui.getCore().byId('settingsDialog');
            linkSettingsDialog.close();

            var saveAsTileView = linkSettingsDialog.getContent()[0].getContent()[0];

            assert.equal(saveAsTileView.oTitleInput.getProperty("value"), "Link title");
            assert.equal(saveAsTileView.oSubTitleInput.getProperty("value"), "Link subtitle");
            assert.equal(saveAsTileView.oInfoInput.getProperty("visible"), false);
            assert.equal(saveAsTileView.oInfoInput.getProperty("visible"), false);
            assert.equal(saveAsTileView.oGroupsSelect.getProperty("visible"), false);

            getMetadataStub.restore();
            linkSettingsDialog.destroy();
            done();
        }, 100);

    });

}());
