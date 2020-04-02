// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.tile.DynamicTile
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.ui.tile.DynamicTile");

    var demiTileData = {
            //TileBase Constructor arguments
            title : "testTileTitle",
            subtitle : "testTileSubTitle",
            icon : "sap-icon://world",
            info : "testInfo",
            targetURL : "#testTargetUrl",
            //DynamicTile Constructor arguments
            numberUnit : '$',
            numberFactor : 'Units%'
        },
        translationBundle = sap.ushell.resources.i18n,
        dynamicTile,
        testContainer;

    module("sap.ushell.ui.tile.DynamicTile", {
        setup: function () {
            dynamicTile = new sap.ushell.ui.tile.DynamicTile(demiTileData);
            testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            dynamicTile.destroy();
            jQuery(testContainer).remove();
        }
    });

    test("Constructor Test", function () {
        ok(dynamicTile.getNumberUnit() === demiTileData.numberUnit, "Number Unit Test");
        ok(dynamicTile.getNumberFactor() === demiTileData.numberFactor, "Number Factor Test");
        //Test constructor arguments with default values
        ok(dynamicTile.getNumberValue() === '0.0', "Number Value Test");
        ok(dynamicTile.getNumberState() === 'Neutral', "Number State Test");
        ok(dynamicTile.getNumberDigits() === 0, "Number Digits Test");
        ok(dynamicTile.getStateArrow() === 'None', "State Arrow Test");
    });

    asyncTest("test - empty string should be rendered as number value and not '0'", function () {
        var tileData = {
                title: "testTitle",
                numberValue: ''
            },
            tile = new sap.ushell.ui.tile.DynamicTile(tileData);
        tile.placeAt('testContainer');

        setTimeout(function () {
            start();
            var actualValue = jQuery(".sapUshellDynamicTileNumber")[0].innerHTML;
            ok(actualValue === '', "Number Value Test.Expected value = '' actual value = " + actualValue);
            tile.destroy();
        }, 0);
    });

    asyncTest("Render Part - DynamicTile wrapping structure Test", function () {
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var bSapUshellDynamicTileClassAdded = testContainer.find('.sapUshellDynamicTile').length > 0,
                dynamicTileIndicationDiv,
                sapUshellDynamicTileClassDiv,
                sapUshellDynamicTileClassInnerDiv;

            //Check whether a div with sapUshellDynamicTile has been created.
            ok(bSapUshellDynamicTileClassAdded, "Div with CSS Class: 'sapUshellDynamicTile' is added");
            sapUshellDynamicTileClassDiv = testContainer.find('.sapUshellDynamicTile');
            sapUshellDynamicTileClassInnerDiv = jQuery(sapUshellDynamicTileClassDiv).find('div:first');
            ok(sapUshellDynamicTileClassInnerDiv.hasClass('sapUshellDynamicTileData'), "CSS Class: 'sapUshellDynamicTileData' is added on Tile Data inner div");
            //The class: 'sapUshellDynamicTileDataNeutral'is a default class that should be added if 'NumberState' hasn't been defined.
            ok(sapUshellDynamicTileClassInnerDiv.hasClass('sapUshellDynamicTileDataNeutral'), "CSS Class: 'sapUshellDynamicTileDataNeutral' is added on Tile Data inner div");
            dynamicTileIndicationDiv = sapUshellDynamicTileClassInnerDiv.find('div:first');
            ok(dynamicTileIndicationDiv.hasClass('sapUshellDynamicTileIndication'), "CSS Class: 'sapUshellDynamicTileIndication' is added on Dynamic Tile Indication div");

        }, 0);
    });

    asyncTest("Render Part - Dynamic Data Test", function () {
        dynamicTile.setNumberState('Critical');
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var dynamicTileDataDiv = testContainer.find('.sapUshellDynamicTileData')[0],
                bIsNumberStateClassAdded = jQuery(dynamicTileDataDiv).hasClass('sapUshellDynamicTileDataCritical');

            ok(bIsNumberStateClassAdded, "Add Number-State Class Test");
        }, 0);
    });

    asyncTest("Render Part - No State Arrow default behaviour Test", function () {
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var dynamicTileStateArrowDiv = jQuery('.sapUshellDynamicTileIndication').find('div:first');

            ok(dynamicTileStateArrowDiv.hasClass('sapUshellDynamicTileDataNone') && dynamicTileStateArrowDiv.hasClass('sapUshellDynamicTileStateArrow'), "No State Arrow Test");
        }, 0);
    });

    asyncTest("Render Part - State Arrow rendering Test", function () {
        dynamicTile.setStateArrow('Up');
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var dynamicTileStateArrowDiv = jQuery('.sapUshellDynamicTileIndication').find('div:first');

            dynamicTileStateArrowDiv = jQuery('.sapUshellDynamicTileIndication').find('div:first');
            ok(dynamicTileStateArrowDiv.hasClass('sapUshellDynamicTileDataUp') && dynamicTileStateArrowDiv.hasClass('sapUshellDynamicTileStateArrow'), "Add Number-State Class Test");
            ok(!dynamicTileStateArrowDiv.hasClass('sapUshellDynamicTileDataNone'), "sapUshellDynamicTileDataNone shouldn't be added");
        }, 0);
    });

    asyncTest("Render Part - Number Factor rendering Test", function () {
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var aTileIndicationDivChildern = jQuery(jQuery('.sapUshellDynamicTileIndication')).children(),
                brakeLineElement = jQuery(jQuery('.sapUshellDynamicTileIndication').find('br:first')),
                dynamicTileNumberFactorDiv = jQuery(jQuery('.sapUshellDynamicTileNumberFactor')),
                arialLabelUnits = dynamicTileNumberFactorDiv.attr('aria-label'),
                expectedAriaLabelText = translationBundle.getText("TileUnits_lable") + demiTileData.numberFactor,
                bBrakeLineBeforeNumberFactor;

            ok(dynamicTileNumberFactorDiv, "CSS Class: 'sapUshellDynamicTileNumberFactor' is added Test");
            bBrakeLineBeforeNumberFactor = aTileIndicationDivChildern.index(brakeLineElement) < aTileIndicationDivChildern.index(dynamicTileNumberFactorDiv);
            ok(bBrakeLineBeforeNumberFactor, "<br> is added before the div with the numberFactor class");
            ok(arialLabelUnits === expectedAriaLabelText, "Number Factor aria-label Test");
            ok(dynamicTileNumberFactorDiv.text() === demiTileData.numberFactor, "Number Factor text value Test");
        }, 0);
    });

    var dynamicTileValidator = function (expectedAriaLabelText, expectedValueText) {
        start();
        var aTileIndicationDivChildern = jQuery(jQuery('.sapUshellDynamicTileIndication')).children(),
            brakeLineElement = jQuery(jQuery('.sapUshellDynamicTileIndication').find('br:first')),
            dynamicTileNumberFactorDiv = jQuery(jQuery('.sapUshellDynamicTileNumberFactor')),
            valueElement = jQuery('.sapUshellDynamicTileNumber'),
            bBrakeLineBeforeNumberFactor;

        ok(dynamicTileNumberFactorDiv, "CSS Class: 'sapUshellDynamicTileNumberFactor' is added Test");
        bBrakeLineBeforeNumberFactor = aTileIndicationDivChildern.index(brakeLineElement) < aTileIndicationDivChildern.index(dynamicTileNumberFactorDiv);
        ok(bBrakeLineBeforeNumberFactor, "<br> is added before the div with the numberFactor class");
        ok(dynamicTileNumberFactorDiv.text() === expectedAriaLabelText, "Number Factor text value Test");
        ok(valueElement.text() === expectedValueText, "Number Factor text value Test");

    };

    asyncTest("Scaling Factor - 1234 Test", function () {
        dynamicTile.setNumberValue(1234);
        dynamicTile.setNumberDigits(4);
        dynamicTile.setNumberFactor();
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            dynamicTileValidator('', "1,234");
        }, 0);
    });

    asyncTest("Scaling Factor - 1234567 Test", function () {
        dynamicTile.setNumberValue(1234567);
        dynamicTile.setNumberFactor();
        dynamicTile.setNumberDigits(4);
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            dynamicTileValidator('M', "1.23");
        }, 0);
    });

    asyncTest("Scaling Factor - 123.456 Test", function () {
        dynamicTile.setNumberValue(123.456);
        dynamicTile.setNumberFactor();
        dynamicTile.setNumberDigits(4);
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            dynamicTileValidator('', "123");
        }, 0);
    });

    asyncTest("Scaling Factor - 123.456  No Icon Test", function () {
        dynamicTile.setNumberValue(123.456);
        dynamicTile.setNumberFactor();
        dynamicTile.setIcon("");
        dynamicTile.setNumberDigits(4);
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            dynamicTileValidator('', "123.4");
        }, 0);
    });

    asyncTest("Scaling Factor - 100000 Test", function () {
        dynamicTile.setNumberValue(100000);
        dynamicTile.setNumberFactor();
        dynamicTile.setNumberDigits(4);
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            dynamicTileValidator('K', "100");
        }, 0);
    });

    asyncTest("DE Scaling Factor - nagative 123 Test", function () {
        dynamicTile.setNumberValue(-123);
        dynamicTile.setNumberFactor();
        dynamicTile.setNumberDigits(4);
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            dynamicTileValidator('', "-123");
        }, 0);
    });

    asyncTest("DE Scaling Factor - 1234567 Test", function () {
        var orgLang = sap.ui.getCore().getConfiguration().getLanguage();
        sap.ui.getCore().getConfiguration().setLanguage("de");
        dynamicTile.setNumberValue(1234567);
        dynamicTile.setNumberFactor();
        dynamicTile.setNumberDigits(4);
        dynamicTile.placeAt('testContainer');
        setTimeout(function () {
            dynamicTileValidator('M', "1,23");
            sap.ui.getCore().getConfiguration().setLanguage(orgLang);
        }, 0);
    });
}());