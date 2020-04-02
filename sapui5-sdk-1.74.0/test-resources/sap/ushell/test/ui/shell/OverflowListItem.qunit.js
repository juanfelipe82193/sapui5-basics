// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.shell.OverflowListItem
 */

// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for MeArea.controller
 */
sap.ui.require([
    'sap/ushell/ui/shell/OverflowListItem'
], function (OverflowListItem) {
    "use strict";
    /* global QUnit */


    QUnit.module("sap.ushell.ui.shell.OverflowListItem", {});

    QUnit.test("Create an overflow item without floating number: no 'sapUshellShellHeadItmCounter' class added to image", function (assert) {
        // Arrange
        var oConfig = {
                id: "testItem",
                title: "Head Item Text",
                icon: "sap-icon://home"
            },
            oOverflowListItem;

        // Act
        oOverflowListItem = new OverflowListItem(oConfig);
        var oImage = oOverflowListItem._getImage();

        // Assert
        assert.notOk(oImage.hasStyleClass("sapUshellShellHeadItmCounter"), "Overflow list item without floating number does not have an additional CSS class ");

        oOverflowListItem.destroy();
    });

    QUnit.test("Create an overflow item without floating number: 'sapUshellShellHeadItmCounter' class and custom data added to the image", function (assert) {
        // Arrange
        var oConfig = {
                id: "testItem",
                title: "Head Item Text",
                icon: "sap-icon://home",
                floatingNumber: 3
            },
            oOverflowListItem;

        // Act
        oOverflowListItem = new OverflowListItem(oConfig);
        var oImage = oOverflowListItem._getImage();
        var oCustomData = oImage.getCustomData();

        // Assert
        assert.ok(oImage.hasStyleClass("sapUshellShellHeadItmCounter"), "Overflow list item  with floating number has an additional CSS class ");
        assert.strictEqual(oCustomData.length, 1, "Overflow list item with floating number has custom data.");
        assert.strictEqual(oCustomData[0].getKey(), "counter-content", "Custom data contains key 'counter-content'");
        assert.equal(oCustomData[0].getValue(), oConfig.floatingNumber, "with value " + oConfig.floatingNumber);
        assert.strictEqual(oCustomData[0].getWriteToDom(), true, "and 'writeToDom' set to 'true'");

        oOverflowListItem.destroy();
    });
});
