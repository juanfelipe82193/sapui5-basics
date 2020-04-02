// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
(function () {
    "use strict";
    /* global module,ok,test,asyncTest,jQuery,sap,sinon*/
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.ui.shell.RightFloatingContainer");
    jQuery.sap.require('sap.m.NotificationListItem');

    var jqTempRightFloatingContainer,
        oRightFloatingContainer,
        oClock,
        testContainer,
        demiItemData = {
            id : 'testRightFloatingContainer'
        };


    module("sap.ushell.ui.shell.RightFloatingContainer", {
        /**
         * This method is called before each test
         */
        setup: function () {
            sap.ushell.bootstrap("local");
            oRightFloatingContainer = new sap.ushell.ui.shell.RightFloatingContainer(demiItemData);
            testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
            oRightFloatingContainer.placeAt('testContainer');
            oClock = sinon.useFakeTimers();
        },
        /**
         * This method is called after each test. Add every restoration code here
         */
        teardown: function () {
            oClock.restore();
            oRightFloatingContainer.destroy();
            jQuery(testContainer).remove();
            delete sap.ushell.Container;
        }
    });

    test("Constructor Test", function () {
       jqTempRightFloatingContainer = jQuery('<div id="jqAnchorItem1" class="sapUshellRightFloatingContainer" style="height: 700px; width: 0; top: 200px">').appendTo('body');

        var oShellElement = new sap.ushell.ui.shell.RightFloatingContainer({
            floatingContainerItems: new sap.m.NotificationListItem({
                id: 'testButton',
                icon: "sap-icon://documents"
            })
        });

        ok(oShellElement.getFloatingContainerItems()[0].sId === "testButton", "Vaidate testButton is first element in the right floating container");
        oShellElement.removeFloatingContainerItem("testButton");
        ok(oShellElement.getFloatingContainerItems().length === 0, "Vaidate no elements in the right floating container");

        jQuery(jqTempRightFloatingContainer).remove();
    });

    test("Test When adding the 6th element to the right floating container we need to hide the last one", function () {
        oRightFloatingContainer.setInsertItemsWithAnimation(true);
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item0'}));
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item1'}));
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item2'}));
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item3'}));
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item4'}));
        oClock.tick(550);
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item5'}));
        oClock.tick(550);

        var items = oRightFloatingContainer.getFloatingContainerItems();

        ok(items[5].hasStyleClass("sapUshellRightFloatingContainerHideLastItem") === true, "Last item should be hidden when there are more than 5 items in the list");
        ok(items[0].hasStyleClass("sapUshellRightFloatingContainerHideLastItem") === false, "First item should not be hidden when there are more than 5 items in the list");
    });

    test("Test setFloatingContainerItemsVisiblity - set visible true", function () {
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item0'}));
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item1'}));
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item2'}));
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item3'}));
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item4'}));

        oRightFloatingContainer.setFloatingContainerItemsVisiblity(true);
        var items = oRightFloatingContainer.getFloatingContainerItems();
        oClock.tick(299);
        ok(items[0].hasStyleClass("sapUshellRightFloatingContainerItemBounceIn") === false, "first item's class is sapUshellRightFloatingContainerItemBounceOut");
        oClock.tick(100);
        items = oRightFloatingContainer.getFloatingContainerItems();
        ok(items[0].hasStyleClass("sapUshellRightFloatingContainerItemBounceIn") === true, "first item's class is sapUshellRightFloatingContainerItemBounceIn");
        ok(items[1].hasStyleClass("sapUshellRightFloatingContainerItemBounceIn") === false, "second item's class is sapUshellRightFloatingContainerItemBounceOut");
        oClock.tick(2);
        items = oRightFloatingContainer.getFloatingContainerItems();
        ok(items[1].hasStyleClass("sapUshellRightFloatingContainerItemBounceIn") === true, "second item's class is sapUshellRightFloatingContainerItemBounceIn");
        oClock.tick(300);
        items = oRightFloatingContainer.getFloatingContainerItems();
        ok(items[4].hasStyleClass("sapUshellRightFloatingContainerItemBounceIn") === true, "last item's class is sapUshellRightFloatingContainerItemBounceIn");
    });

    test("Test setFloatingContainerItemsVisiblity - set visible false", function () {
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item0'}));
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item1'}));
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item2'}));
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item3'}));
        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({title: 'item4'}));

        oRightFloatingContainer.setFloatingContainerItemsVisiblity(false);
        var items = oRightFloatingContainer.getFloatingContainerItems();
        ok(items[0].hasStyleClass("sapUshellRightFloatingContainerItemBounceOut") === false, "first item's class is sapUshellRightFloatingContainerItemBounceIn");
        oClock.tick(1);
        items = oRightFloatingContainer.getFloatingContainerItems();
        ok(items[0].hasStyleClass("sapUshellRightFloatingContainerItemBounceOut") === true, "first item's class is sapUshellRightFloatingContainerItemBounceOut");
        ok(items[1].hasStyleClass("sapUshellRightFloatingContainerItemBounceOut") === false, "second item's class is sapUshellRightFloatingContainerItemBounceIn");
        oClock.tick(100);
        items = oRightFloatingContainer.getFloatingContainerItems();
        ok(items[1].hasStyleClass("sapUshellRightFloatingContainerItemBounceOut") === true, "second item's class is sapUshellRightFloatingContainerItemBounceOut");
        oClock.tick(300);
        items = oRightFloatingContainer.getFloatingContainerItems();
        ok(items[4].hasStyleClass("sapUshellRightFloatingContainerItemBounceOut") === true, "second item's class is sapUshellRightFloatingContainerItemBounceOut");
    });
}());