// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.AnchorItem
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.launchpad.AnchorItem");

    var demiItemData = { index: "{index}",
            title: "group title",
            groupId: "group id",
            selected: false,
            visible: true,
            isGroupRendered: false,
            isGroupVisible: false
        },
        anchorItem,
        testContainer;

    module("sap.ushell.ui.launchpad.AnchorItem", {
        setup: function () {
            anchorItem = new sap.ushell.ui.launchpad.AnchorItem(demiItemData);
            testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');

        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            anchorItem.destroy();
            jQuery(testContainer).remove();
        }
    });

    test("Constructor Test", function () {
        var item = new sap.ushell.ui.launchpad.AnchorItem(demiItemData);
        ok(item.getTitle() === "group title", "Group Title Test");
        ok(item.getGroupId() === "group id", "Group Id Test");
    });

    test("check setSelected", function () {
        anchorItem.setSelected(true);
        ok(anchorItem.getSelected(), "Group Selected Test");
    });

    test("check setTitle", function () {
        var sTitle = "new title";
        anchorItem.setTitle(sTitle);
        ok(anchorItem.getTitle() === sTitle, "Title was changed successfully");
    });

    test("check setGroupId", function () {
        var sGroupId = "new group id";
        anchorItem.setGroupId(sGroupId);
        ok(anchorItem.getGroupId() === sGroupId, "Group id was changed successfully");
    });

    test("check setIsGroupRendered", function () {
        anchorItem.setIsGroupRendered(true);
        ok(anchorItem.getIsGroupRendered() === true, "IsGroupRendered property was changed successfully");
    });

    test("check setIsGroupVisible", function () {
        anchorItem.setIsGroupVisible(true);
        ok(anchorItem.getIsGroupVisible() === true, "IsGroupVisible property was changed successfully");
    });
}());
