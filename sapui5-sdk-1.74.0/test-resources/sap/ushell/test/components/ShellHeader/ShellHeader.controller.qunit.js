// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for ShellHeader.controller
 */
sap.ui.require([
    "sap/ushell/components/_HeaderManager/ShellHeader.controller",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/ui/model/json/JSONModel"
], function (ShellHeaderController, ShellHeadItem, JSONModel) {
    "use strict";
    /* global QUnit */

    var oController;

    QUnit.module("ShellHeader.controller - headEndItemsOverflowItemFactory", {
        beforeEach: function () {
            oController = new ShellHeaderController();
        },
        afterEach: function () {
            if (oController) {
                oController.destroy();
            }
        }
    });

    QUnit.test("Create an overflow item without floating number", function (assert) {
        // Arrange
        var sItemId = "testOverflowItem",
            oConfig = {
                id: "testItem",
                text: "Head Item Text"
            },
            oShellHeadItemModel = new JSONModel({
                data: "test"
            }),
            oContext = {
                getObject: function () {
                    return "testItem";
                }
            },
            oShellHeadItem = new ShellHeadItem(oConfig);
            oShellHeadItem.setModel(oShellHeadItemModel);

        // Act
        var oOverflowItem = oController.headEndItemsOverflowItemFactory(sItemId, oContext);

        // Assert
        assert.strictEqual(oOverflowItem.getId(), sItemId + "-testItem", "Overflow item with a given id created");
        assert.strictEqual(oOverflowItem.getTitle(), oConfig.text, "Overflow item with a given text created");
        assert.strictEqual(oOverflowItem.getFloatingNumber(), 0, "Overflow item floating number equals 0");
        assert.notStrictEqual(oOverflowItem.getModel(), oShellHeadItem.getModel(), "The head item model was not applied");


        oShellHeadItem.destroy();
        oOverflowItem.destroy();
    });
    QUnit.test("Create an overflow item with floating number", function (assert) {
        //Arrange
        var sItemId = "testOverflowItem",
            oConfig = {
                id: "testItem",
                text: "Head Item Text",
                floatingNumber: "{/floatingNumber}"
            },
            oShellHeadItemModel = new JSONModel({
                data: "test",
                floatingNumber: 10
            }),
            oContext = {
                getObject: function () {
                    return "testItem";
                }
            },
            oShellHeadItem = new ShellHeadItem(oConfig);
        oShellHeadItem.setModel(oShellHeadItemModel);

        // Act
        var oOverflowItem = oController.headEndItemsOverflowItemFactory(sItemId, oContext);

        // Assert
        assert.strictEqual(oOverflowItem.getId(), sItemId + "-testItem", "Overflow item with a given id created");
        assert.strictEqual(oOverflowItem.getTitle(), oConfig.text, "Overflow item with a given text created");
        assert.strictEqual(
            oOverflowItem.getFloatingNumber(),
            oShellHeadItemModel.getProperty("/floatingNumber"),
            "Overflow item floating number equals the value from the model");
        assert.strictEqual(oOverflowItem.getModel(), oShellHeadItem.getModel(), "The head item model was not applied");

        oShellHeadItem.destroy();
        oOverflowItem.destroy();
    });

});