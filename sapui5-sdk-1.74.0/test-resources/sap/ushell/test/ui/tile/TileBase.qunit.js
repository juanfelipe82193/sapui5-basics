// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.tile.TileBase
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.tile.TileBase");
    jQuery.sap.require("sap.ushell.resources");

    var demiTileData = {
            title : "testTileTitle",
            subtitle : "testTileSubTitle",
            icon : "sap-icon://world",
            info : "testInfo",
            targetURL : "#testTargetUrl"
        },
        translationBundle = sap.ushell.resources.i18n,
        aTerms = ["Hello", "World"],
        baseTile,
        testContainer;

    module("sap.ushell.ui.tile.TileBase", {
        setup: function () {
            baseTile = new sap.ushell.ui.tile.TileBase(demiTileData);
            testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            baseTile.destroy();
            jQuery(testContainer).remove();
        }
    });

    test("Constructor Test", function () {
        ok(baseTile.getTitle() === demiTileData.title, "title Test");
        ok(baseTile.getSubtitle() === demiTileData.subtitle, "subtitle Test");
        ok(baseTile.getIcon() === demiTileData.icon, "icon Test");
        ok(baseTile.getTargetURL() === demiTileData.targetURL, "target URL Test");
        //Test constructor arguments with default values
        ok(baseTile.getInfoState() === "Neutral", "infoState Test");
        ok(baseTile.getHighlightTerms().length === 0, "highlightTerms Test");
    });

    test("Highlight test", function () {
        var tileBaseRenderer = baseTile.getRenderer(),
            sEncodingTestStr = "\!~@#$%^&*()-_+=",
            sHighlighResult,
            bAllTermsHighlighted = true;

        //HTML-Encoding without highlighting Test
        ok(tileBaseRenderer.highlight([], sEncodingTestStr) === jQuery.sap.encodeHTML(sEncodingTestStr), "HTML-Encoding Test");
        //Check that all the occurrences of the searched terms are highlighted - meaning, surrounded with a <b> and </b> correspondingly.
        sHighlighResult = tileBaseRenderer.highlight(aTerms, "Thw words: Hello and World should be highlighted");
        aTerms.forEach(function (term) {
            var highlightedExp = "<b>" + term + "</b>";
            bAllTermsHighlighted = (sHighlighResult.match(new RegExp(highlightedExp)).length === 1) && bAllTermsHighlighted;
        });
        ok(bAllTermsHighlighted, "All terms highlighted Test");
    });

    asyncTest("Render Tile - BaseTile wrapping structure Test", function () {
        baseTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var bSapUshellTileBaseClassAdded = testContainer.find('.sapUshellTileBase').length > 0,
                bSapUshellTileBaseHeaderAdded,
                sapUshellTileBaseClassDiv;

            //Check whether a div with class:sapUshellTileBase has been created.
            ok(bSapUshellTileBaseClassAdded, "Div with CSS Class: 'sapUshellTileBase' is added");
            sapUshellTileBaseClassDiv = testContainer.find('.sapUshellTileBase')[0];
            //Will be used to check whether a div with class:sapUshellTileBaseHeader has been created as a child of sapUshellTileBaseClassDiv.
            bSapUshellTileBaseHeaderAdded = jQuery(sapUshellTileBaseClassDiv).find('.sapUshellTileBaseHeader').length > 0;
            ok(bSapUshellTileBaseHeaderAdded, "Div with CSS Class: 'sapUshellTileBaseHeader' is added");
        }, 0);
    });

    asyncTest("Render Tile - title Test", function () {
        baseTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var bSapUshellTileBaseTitleClassAdded = testContainer.find('h3:first').attr('class') === 'sapUshellTileBaseTitle',
                ariaLabelTitle = testContainer.find('h3:first').attr('aria-label'),
                titleTooltip = testContainer.find('.sapUshellTileBase').attr('aria-label'),
                //The expected title text should be a concatenation of the accessibility state prefix with the actual title.
                expectedTitleText = translationBundle.getText("TileDetails_lable") + translationBundle.getText("TileTitle_lable") + demiTileData.title;

            ok(bSapUshellTileBaseTitleClassAdded, "CSS Class: 'sapUshellTileBaseTitle' is added on the base-header div");
        }, 0);
    });

    asyncTest("Render Tile - subtitle Test", function () {
        baseTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var bSapUshellTileBaseSubtitleClassAdded = testContainer.find('h4:first').attr('class') === 'sapUshellTileBaseSubtitle',
                ariaLabelSubtitle = testContainer.find('h4:first').attr('aria-label'),
                //The expected subtitle text should be a concatenation of the accessibility state prefix with the actual subtitle.
                expectedSubtitleText = translationBundle.getText("TileSubTitle_lable") + demiTileData.subtitle;

            ok(bSapUshellTileBaseSubtitleClassAdded, "CSS Class: 'sapUshellTileBaseSubtitle' is added on the base-header div");
            ok(ariaLabelSubtitle === expectedSubtitleText, "Subtitle added in an aria-label");
        }, 0);
    });

    asyncTest("Render Tile - highlighted terms test", function () {
        baseTile.setTitle('Thw words: Hello and World should be highlighted');
        baseTile.setSubtitle('Thw words: Hello and World should be highlighted');
        baseTile.setHighlightTerms(aTerms);
        baseTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var bHighlightedTermsMatching = true,
                actualTitleText = testContainer.find('h3:first'),
                actualSubTitleText = testContainer.find('h4:first'),
                actualTitleHighlighted = jQuery(actualTitleText).find('b'),
                actualSubTitleHighlighted = jQuery(actualSubTitleText).find('b');

            for (var i = 0; i < aTerms.length; i++){
                bHighlightedTermsMatching = bHighlightedTermsMatching
                    && (aTerms[i] === actualTitleHighlighted[i].textContent)
                    && (aTerms[i] === actualSubTitleHighlighted[i].textContent);
            }
            ok(bHighlightedTermsMatching, "All highlighted terms are matching test");
        },0);
    });

    asyncTest("Render Tile - icon Test", function () {
        baseTile.placeAt('testContainer');
        setTimeout(function(){
            start();
            var bIsIconAdded = testContainer.find('span:first').attr('class').indexOf('sapUshellTileBaseIcon') > -1;

            ok(bIsIconAdded, "check icon is added test");
        }, 0);
    });

    asyncTest("Render Tile - Default state Info Test", function () {
        baseTile.placeAt('testContainer');
        setTimeout(function(){
            start();
            var infoDiv = testContainer.find('.sapUshellTileBaseInfo')[0],
                //When TileBase is instantiated without infoState, the default infoState class should be: 'sapUshellTileBaseNeutral'.
                bDefaultInfoStateClassAdded= jQuery(infoDiv).attr('class').indexOf('sapUshellTileBaseNeutral') > -1,
                ariaLabelInfo = jQuery(infoDiv).attr('aria-label');

            ok(infoDiv.textContent === demiTileData.info, "Info value test")
            ok(bDefaultInfoStateClassAdded, "Info default Css Class test");
            ok(ariaLabelInfo === translationBundle.getText("TileInfo_lable") + demiTileData.info, "Info added in Aria Label Test");
        }, 0);
    });

    asyncTest("Render Tile - Non Default state Info Test", function () {
        baseTile.setInfoState('Positive')
        baseTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var infoDiv = testContainer.find('.sapUshellTileBaseInfo')[0],
                bDefaultInfoStateClassAdded= jQuery(infoDiv).attr('class').indexOf('sapUshellTileBaseNeutral') > -1,
                bPositiveInfoStateClassAdded= jQuery(infoDiv).attr('class').indexOf('sapUshellTileBasePositive') > -1

                //TileBase was instantiated infoState ('Positive'), hence we expect the infoState class to be: 'sapUshellTileBasePositive'.
                ok(!bDefaultInfoStateClassAdded, "No default info Css Class test");
            ok(bPositiveInfoStateClassAdded, "'Positive' Info State class added Test");
        }, 0);
    });

    asyncTest("Render Tile - TileBase without Info Test", function () {
        baseTile.setInfo(undefined);
        baseTile.placeAt('testContainer');
        setTimeout(function () {
            start();
            var bInfoDivExsist = testContainer.find('.sapUshellTileBaseInfo').length > 0;
            //A div for the tile info shouldn't be rendered when TileBase was instantiated without Info.
            ok(!bInfoDivExsist, "No Info Div rendering test");
        }, 0);
    });

}());