// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.ShortcutsHelpContainer
 */
sap.ui.require([
    "sap/ushell/ui/launchpad/ShortcutsHelpContainer",
    "sap/m/Label",
    "sap/m/Text"
], function (ShortcutsHelpContainer, Label, Text) {
    "use strict";
    /*global module ok test jQuery */

    var shortcutsHelpContainer,
        testContainer;

    module("sap.ushell.ui.launchpad.ShortcutsHelpContainer", {
        setup: function () {
            testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');

        },
        teardown: function () {
            if (shortcutsHelpContainer) {
                shortcutsHelpContainer.destroy();
            }
            jQuery(testContainer).remove();
        }
    });

    test("Constructor Test", function () {
        var contentList = [];
        contentList.push(new Label({text: "Alt+M"}));
        contentList.push(new Text({text: "Here is some text"}));
        shortcutsHelpContainer = new ShortcutsHelpContainer({
            content: contentList
        });
        ok(shortcutsHelpContainer.getContent().length === contentList.length, "The content should be set correctly");
    });

    test("check that css class for label set correctly", function (assert) {
        var done = assert.async();
        shortcutsHelpContainer = new ShortcutsHelpContainer({
            content: [new Label({text: "Alt+M"})]
        });
        shortcutsHelpContainer.placeAt('testContainer');
        setTimeout(function () {
            ok(testContainer.find('.sapUshelShortcutsHelpContainerLabel').length === 1, 'Label CSS class should be set correctly');
            ok(testContainer.find('.sapUshelShortcutsHelpContainerText').length === 0, 'There is no text css class');
            done();
        }, 100);
    });

    test("check that css class for not label control set correctly", function (assert) {
        var done = assert.async();
        shortcutsHelpContainer = new ShortcutsHelpContainer({
            content: [
                new Text({text: "Text0"}),
                new Text({text: "Text1"})
            ]
        });
        shortcutsHelpContainer.placeAt('testContainer');
        setTimeout(function () {
            ok(testContainer.find('.sapUshelShortcutsHelpContainerLabel').length === 0, 'There is no label css class');
            ok(testContainer.find('.sapUshelShortcutsHelpContainerText').length === 2, 'CSS class for text is set correctly');
            done();
        }, 100);
    });

});
