// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.GroupListItem
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
    notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
    jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.launchpad.GroupListItem");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");

    module("sap.ushell.ui.launchpad.GroupListItem", {
        setup: function () {
            sap.ushell.bootstrap("local");
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
        }
    });
    var demiItemData = {
            title : "defaultGroup",
            defaultGroup : true,
            groupId : "group1",
            editMode : false,
            numberOfTiles : 5,
            afterRendering : function afterRender() {}
        };

    test("Constructor Test", function () {
        var item = new sap.ushell.ui.launchpad.GroupListItem(demiItemData);
        ok(item.getTitle() === "defaultGroup", "title Test");
        ok(item.getGroupId() === "group1", "id Test");
    });
}());
