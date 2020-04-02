// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.ActionItem
 */
(function () {
    "use strict";
    /*global asyncTest, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.ui.launchpad.ActionItem");
    var actionItem,
        oClock,
        testContainer;
    module("sap.ushell.ui.launchpad.ActionItem", {
        setup: function () {
            actionItem = new sap.ushell.ui.launchpad.ActionItem({
                text: 'action',
                tooltip: 'action',
                icon: 'sap-icons://person-placeholder'
            });
            testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
            oClock = sinon.useFakeTimers();

        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            oClock.restore();
            actionItem.destroy();
            jQuery(testContainer).remove();
        }
    });

    test("ActionItem default actionType Test", function () {
        actionItem.placeAt('testContainer');
        var sActionType = actionItem.getActionType();
        ok(sActionType === 'standard', 'default actionType is "standard"');
    });

    test("ActionItem 'action' actionType Test", function () {
        actionItem.setActionType('action');
        actionItem.placeAt('testContainer');
        oClock.tick(100);
        var sActionType = actionItem.getActionType();
        ok(sActionType === 'action', 'action type is saved');
        ok(actionItem.getType() === 'Unstyled', 'sap.m.Button.Type is set to "Unstyled"');
    });

    test("ActionItem change actionType Test", function () {
        actionItem.setType('Transparent');
        actionItem.setActionType('action');
        actionItem.setActionType('standard');
        actionItem.placeAt('testContainer');
        oClock.tick(100);
        var sActionType = actionItem.getActionType();
        ok(sActionType === 'standard', 'action type is saved');
        ok(actionItem.getType() === 'Transparent', 'sap.m.Button.Type is set to "Transparent"');
    });

}());
