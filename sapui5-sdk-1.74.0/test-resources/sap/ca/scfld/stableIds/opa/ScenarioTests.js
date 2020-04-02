// Copyright (C) 2015 SAP SE or an SAP affiliate company. All rights reserved
sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/opaQunit",
    "sap/ui/test/matchers/Properties"
], function (Opa5, opaTest, Properties) {
    /*global QUnit */
    "use strict";

    QUnit.module("sap.ca.scfld.stableids.opa.ScenarioTests");

    opaTest("Buttons with same ID in different views", function (Given, When, Then) {
        Given.iStartMyApp("stableIDs=true&master.buttonlist=1&master.buttonlist.0.id=MYID" +
            "&detail.buttonlist=1&detail.buttonlist.0.id=MYID");
        Then.onTheMaster.checkId(false, "appButton", "MYID", "Button0");
        Then.onTheDetail.checkId(false, "appButton", "MYID", "Button0");
        Then.iTeardownMyAppFrame();
    });

    opaTest("Master List Refresh", function (Given, When, Then) {
        var sId;
        Given.iStartMyApp("stableIDs=true&master.buttonlist=2&master.buttonlist.0.id=MYID" +
            "&master.buttonlist.0.text=MyButton&master.buttonlist.1.text=MyButton2" +
            "&master.sort&master.sort.items=a,b,c&master.filter&master.add&master.edit");
        Then.onTheMaster.checkId(false, "appButton", "MYID", "MyButton");
        Then.onTheMaster.checkId(false, "add");
        Then.onTheMaster.checkId(false, "edit");
        When.onTheMaster.click("overflow");
        Then.onTheMaster.checkIdInOverflow(false, "sort");
        Then.onTheMaster.checkIdInOverflow(false, "filter");
        Then.onTheMaster.waitFor({
            controlType: "sap.m.Button",
            viewName: "sap.ca.scfld.stableids.app.view.S2",
            searchOpenDialogs: true,
            matchers: new Properties({text: "MyButton2"}),
            success: function (aControls) {
                Opa5.assert.strictEqual(aControls.length, 1, "one Control");
                sId = aControls[0].getId();
            },
            errorMessage: "Did not find MyButton2"
        });
        // refresh list causes rerendering of the footerbar
        When.onTheDetail.refreshList();
        // check again
        Then.onTheMaster.checkId(false, "appButton", "MYID", "MyButton");
        Then.onTheMaster.checkId(false, "add");
        Then.onTheMaster.checkId(false, "edit");
        When.onTheMaster.click("overflow");
        Then.onTheMaster.checkIdInOverflow(false, "sort");
        Then.onTheMaster.checkIdInOverflow(false, "filter");
        Then.onTheMaster.waitFor({
            controlType: "sap.m.Button",
            viewName: "sap.ca.scfld.stableids.app.view.S2",
            searchOpenDialogs: true,
            matchers: new Properties({text: "MyButton2"}),
            success: function (aControls) {
                var secondId;
                Opa5.assert.strictEqual(aControls.length, 1, "one Control");
                secondId = aControls[0].getId();
                Opa5.assert.notEqual(sId, secondId,
                    "different IDs for buttons without stable ID: " + sId + " != " + secondId);
            },
            errorMessage: "Did not find MyButton2"
        });
        Then.iTeardownMyAppFrame();
    });

    opaTest("Window Resizing", function (Given, When, Then) {
        var iButtonCount, iButtonCount2, iExpectedFrameWidth, oFrame, iWaitCount, iWidth,
            oWaitForFrame = {
                controlType: "sap.m.ObjectHeader", // try to get only one hit
                viewName: "sap.ca.scfld.stableids.app.view.S3",
                matchers: function (oControl) {
                    // wait until frame has the expected size
                    if (oFrame.width() === iExpectedFrameWidth) {
                        iWaitCount -= 1;
                        return iWaitCount < 0;
                    }
                    jQuery.sap.log.debug("TEST: " + oControl + ", waitCount: " + iWaitCount
                        + ", width: " + oFrame.width());
                    return false;
                },
                errorMessage: "Error"
            };
        Given.iStartMyApp("stableIDs=true&detail.buttonlist=16" +
            "&detail.buttonlist.0.id=first&detail.buttonlist.0.text=FIRST" +
            "&detail.buttonlist.15.id=last&detail.buttonlist.15.text=LAST");
        Then.onTheDetail.checkId(false, "appButton", "first", "FIRST");
        // initially set width of iFrame to 1100
        Then.onTheDetail.waitFor({
            controlType: "sap.m.ObjectHeader", // try to get only one hit
            viewName: "sap.ca.scfld.stableids.app.view.S3",
            success: function (aControls) {
                oFrame = jQuery("#OpaFrame");
                oFrame.animate({width: "900px"}, 'fast');
                // set size and count for next wait
                iExpectedFrameWidth = 900;
                iWaitCount = 3;
            },
            errorMessage: "Error"
        });
        // wait until animation is finished
        Then.onTheDetail.waitFor(oWaitForFrame);
        When.onTheDetail.click("overflow", undefined, true);
        Then.onTheDetail.checkIdInOverflow(false, "appButton", "last", "LAST");
        When.onTheDetail.click("appButton", "FIRST"); // to close the overflow
        Then.onTheDetail.waitFor({
            controlType: "sap.m.Button",
            viewName: "sap.ca.scfld.stableids.app.view.S3",
            success: function (aControls) {
                iButtonCount = aControls.length;
                Opa5.assert.ok(true, iButtonCount + " Buttons on detail view");
                iWidth = oFrame.width();
                Opa5.assert.ok(true, iWidth + " original width");
                oFrame.animate({width: "300px"}, 'fast');
                // set size and count for next wait
                iExpectedFrameWidth = 300;
                iWaitCount = 3;
            },
            errorMessage: "Error"
        });
        Then.onTheDetail.checkId(false, "appButton", "first", "FIRST");
        When.onTheDetail.click("overflow", undefined,  true);
        Then.onTheDetail.checkIdInOverflow(false, "appButton", "last", "LAST");
        When.onTheDetail.click("appButton", "FIRST"); // to close the overflow
        // wait until animation is finished
        Then.onTheDetail.waitFor(oWaitForFrame);
        Then.onTheDetail.waitFor({
            controlType: "sap.m.Button",
            viewName: "sap.ca.scfld.stableids.app.view.S3",
            success: function (aControls) {
                iButtonCount2 = aControls.length;

                Opa5.assert.ok(iButtonCount2 < iButtonCount,
                    "Less buttons expected " + iButtonCount2 + " < " + iButtonCount);
                oFrame.animate({width: iWidth + "px"}, 'fast');
                // set size and count for next wait
                iExpectedFrameWidth = iWidth;
                iWaitCount = 3;
            }
        });
        Then.onTheDetail.checkId(false, "appButton", "first", "FIRST");
        When.onTheDetail.click("overflow", undefined,  true);
        Then.onTheDetail.checkIdInOverflow(false, "appButton", "last", "LAST");
        When.onTheDetail.click("appButton", "FIRST"); // to close the overflow
        // wait until animation is finished
        Then.onTheDetail.waitFor(oWaitForFrame);
        Then.onTheDetail.waitFor({
            controlType: "sap.m.Button",
            viewName: "sap.ca.scfld.stableids.app.view.S3",
            success: function (aControls) {
                var iButtonCount3;
                iButtonCount3 = aControls.length;
                Opa5.assert.ok(iButtonCount3 > iButtonCount2, "Buttons restored");
            },
            errorMessage: "Error"
        });
        Then.iTeardownMyAppFrame();
    });
});