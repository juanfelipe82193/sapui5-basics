// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
sap.ui.require([
    "sap/collaboration/components/fiori/feed/dialog/Component",
    "sap/ushell/ui/footerbar/JamDiscussButton"
], function (
    FeedDialogComponent
    // JamDiscussButton
) {
    "use strict";

    /* global module, ok, test, sinon */

    module("sap.ushell.ui.footerbar.JamDiscussButton", {
        setup: function () { },
        teardown: function () { }
    });

    test("Constructor Test", function () {
        var JamDiscussDialog = new sap.ushell.ui.footerbar.JamDiscussButton();
        ok(JamDiscussDialog.getIcon() == "sap-icon://discussion-2", "Check dialog icon");
        ok(JamDiscussDialog.getText("text") == sap.ushell.resources.i18n.getText("discussBtn"), "Check dialog title");
    });

    test("showDiscussDialog Test", function () {
        var settingsData = {},
            oSandBox = sinon.sandbox.create();

        oSandBox.stub(FeedDialogComponent.prototype, "createContent", function () { });
        oSandBox.stub(FeedDialogComponent.prototype, "setSettings", function (settingObject) {
            settingsData = settingObject;
        });
        oSandBox.stub(FeedDialogComponent.prototype, "open", function () { });

        var JamDiscussDialog = new sap.ushell.ui.footerbar.JamDiscussButton({
            jamData: {
                object: {
                    id: window.location.href,
                    display: new sap.m.Text({ text: "Test One" })
                },
                oDataServiceUrl: 'Some url',
                feedType: 'type',
                groupIds: 'noGroups'
            }
        });

        // Show the dialog
        JamDiscussDialog.showDiscussDialog();
        ok(settingsData.object.id === window.location.href, "Check id");
        ok(settingsData.object.display.getText() === "Test One", "Check display text");
        ok(settingsData.oDataServiceUrl === "Some url", "Check oDataServiceUrl");
        ok(settingsData.feedType === "type", "Check feedType");
        ok(settingsData.groupIds === "noGroups", "Check groupIds");
        oSandBox.restore();
    });
});
