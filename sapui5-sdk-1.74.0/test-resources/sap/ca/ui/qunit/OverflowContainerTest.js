window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.m.IconTabBar");
    jQuery.sap.require("sap.ca.ui.OverflowContainer");
    jQuery.sap.require("sap.ui.layout.form.SimpleForm");
    var oOverflowContainer1 = new sap.ca.ui.OverflowContainer("OverflowContainer1", {
        content: [
            new sap.ui.layout.form.SimpleForm({
                minWidth: 1024,
                maxContainerCols: 2,
                content: [
                    new sap.m.Label({ // this starts a new group
                        text: "Company Address"
                    }),
                    new sap.m.Label({
                        text: 'Name'
                    }),
                    new sap.m.Text({
                        text: 'SAP Germany'
                    }),
                    new sap.m.Label({
                        text: 'Street'
                    }),
                    new sap.m.Text({
                        text: 'Dietmar-Hopp-Allee 16'
                    }),
                    new sap.m.Label({
                        text: 'City'
                    }),
                    new sap.m.Text({
                        text: '69190 Walldorf'
                    }),
                    new sap.m.Label({
                        text: 'Country'
                    }),
                    new sap.m.Text({
                        text: 'Germany'
                    })
                ]
            })
        ]
    });
    var oOverflowContainer2 = new sap.ca.ui.OverflowContainer("OverflowContainer2", {
        content: [
            new sap.m.List({
                items: [
                    new sap.m.FeedListItem({
                        sender: "Giselle Ashante-Ramirez",
                        info: "Request",
                        timestamp: "March 03, 2013",
                        text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum."
                    }),
                    new sap.m.FeedListItem({
                        sender: "Johannes Schaffensteiger",
                        info: "Reply",
                        timestamp: "March 04, 2013",
                        text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore"
                    }),
                    new sap.m.FeedListItem({
                        sender: "Giselle Ashante-Ramirez",
                        info: "Request",
                        timestamp: "March 04, 2013",
                        text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat"
                    }),
                    new sap.m.FeedListItem({
                        sender: "Johannes Schaffensteiger",
                        info: "Rejection",
                        timestamp: "March 07, 2013",
                        text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
                    })
                ]
            })
        ]
    });

    var oIconTabFilter1 = new sap.m.IconTabFilter("iconTabFilter1", {
        key: "key1",
        count: "1",
        text: "Simple Form",
        icon: "sap-icon://task",
        content: oOverflowContainer1
    });

    var oIconTabFilter2 = new sap.m.IconTabFilter("iconTabFilter2", {
        key: "key2",
        text: "List",
        icon: "sap-icon://task",
        content: oOverflowContainer2
    });

    var oTabContainer = new sap.m.IconTabBar({
        id: "TabContainer",
        items: [
            oIconTabFilter1,
            oIconTabFilter2
        ]
    });

    oTabContainer.placeAt("content");
    sap.ui.getCore().applyChanges(); // force rendering

    //////////////////////////////////////
    //  Testing Part: OverflowContainer //
    //////////////////////////////////////
    module("Initial Check");
    // testing
    test("Initialization", function () {
        ok(jQuery.sap.domById("TabContainer"), "IconTabBar should be rendered");
        ok(jQuery.sap.domById("iconTabFilter1"), "First IconTabBarFilter should be rendered");
        ok(jQuery('.sapCaUiOCOverlay'), "Overlay should be rendered");
        equal(jQuery('.sapCaUiOCOverlay:visible').length, 0, "Overlay initial state is not visible");
        equal(sap.ui.getCore().byId("iconTabFilter1").getText(), "Simple Form", "Text of first IconTabBarFilter should be 'Simple Form'");
    });

    module("Open and Close");

    asyncTest("Open : Expand first overflow container ", function () {
        ok(!oOverflowContainer1.getExpanded(), "oOverflowContainer is fold");
        oOverflowContainer1._getButton().fireTap();
        setTimeout(function () {
            equal(oOverflowContainer1.getExpanded(), true, "oOverflowContainer is now open");
            equal(jQuery('.sapCaUiOCOverlay:visible').length, 0, "Overlay is not displayed");
            ok(jQuery.sap.domById("OverflowContainer1"), "First OverflowContainer is rendered after it's opened.");
            start();
        }, 450);
    });

    asyncTest("Close : Collapse first overflow container ", function () {
        ok(oOverflowContainer1.getExpanded(), "oOverflowContainer is expanded");
        oOverflowContainer1._getButton().fireTap();
        setTimeout(function () {
            equal(oOverflowContainer1.getExpanded(), false, "oOverflowContainer is now fold");
            equal(jQuery('.sapCaUiOCOverlay:visible').length, 1, "Overlay is displayed");
            ok(jQuery.sap.domById("OverflowContainer1"), "First OverflowContainer is rendered after it's opened.");
            start();
        }, 450);
    });

    asyncTest("Change iconTabFilter and  of the IconTabBar", function () {
        //selectEvent should be fired
        oTabContainer.setSelectedItem(oIconTabFilter1);
        //no selectEvent should be fired
        oTabContainer.setSelectedItem(oIconTabFilter2);
        setTimeout(function () {
            equal(oOverflowContainer2.getExpanded(), false, "oOverflowContainer is fold");
            equal(jQuery('.sapCaUiOCOverlay:visible').length, 1, "Overlay is displayed"); // Selects all elements that are visible. (hidden
            ok(jQuery.sap.domById("OverflowContainer2"), "Second OverflowContainer is rendered after IconTabFilter change.");
            start();
        }, 1000);
    });
});
