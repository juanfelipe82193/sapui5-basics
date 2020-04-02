window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.ca.ui.utils.busydialog");

    var page = new sap.m.Page("myFirstPage", {
        title: "Fiori - Busy Dialog Test",
        showNavButton: true,
        enableScrolling: true
        // ,
        // content: oHtml
    });

    var oButton = new sap.m.Button({
        text: "Open Busy Dialog",
        press: function () {
            sap.ca.ui.utils.busydialog.requireBusyDialog();
        }
    });

    var app = new sap.m.App("myApp", {
        initialPage: "myFirstPage"
    });

    app.addPage(page).placeAt("content");
    sap.ui.getCore().applyChanges();

    var BUSIDIALOG_ID = "CA_BusyDialog";

    module("Initial Check");

    test("Initialization", function () {
        ok(!sap.ui.getCore().byId(BUSIDIALOG_ID), "Dialog is not rendered before it's ever opened.");
    });

    module("Request Busy Dialog once and then Release it and then Destroy it");

    test("Open Busy Dialog", function (assert) {
        var done = assert.async();
        assert.expect(1);
        oButton.firePress();
        setTimeout(function () {
            var oBusyDialog = sap.ui.getCore().byId(BUSIDIALOG_ID);
            assert.ok(oBusyDialog, "Dialog is rendered");
            done();
        }, 5000);
    });

    test("Close Busy Dialog", function (assert) {
        var done = assert.async();
        assert.expect(1);
        setTimeout(function () {
            var oBusyDialog = sap.ui.getCore().byId(BUSIDIALOG_ID);
            var fnAttachClose = function () {
                assert.ok(true, "Busy Dialog is closed");
                oBusyDialog.detachClose(fnAttachClose);
                done();
            };
            oBusyDialog.attachClose(fnAttachClose);
            sap.ca.ui.utils.busydialog.releaseBusyDialog();
        }, 2000);
    });

    test("Destroy Busy Dialog", function (assert) {
        var done = assert.async();
        assert.expect(1);
        sap.ca.ui.utils.busydialog.destroyBusyDialog();
        setTimeout(function () {
            assert.ok(!sap.ui.getCore().byId(BUSIDIALOG_ID), "Dialog is destroyed from UI5 core.");
            done();
        }, 2000);
    });

    module("Request Busy Dialog twice and then Release it twice");

    test("Request Busy Dialog for the 1. time", function (assert) {
        var done = assert.async();
        assert.expect(1);
        oButton.firePress();
        setTimeout(function () {
            var oBusyDialog = sap.ui.getCore().byId(BUSIDIALOG_ID);
            assert.ok(oBusyDialog, "Dialog is rendered");
            done();
        }, 3000);
    });

    test("Request Busy Dialog for the 2. time", function (assert) {
        var done = assert.async();
        assert.expect(1);
        sap.ca.ui.utils.busydialog.requireBusyDialog({text: "Loading 2..."});
        setTimeout(function () {
            var oBusyDialog = sap.ui.getCore().byId(BUSIDIALOG_ID);
            assert.ok(oBusyDialog, "Busy Dialog is still opening");
            done();
        }, 3000);
    });

    test("Release Busy Dialog for the 1. time", function (assert) {
        var done = assert.async();
        assert.expect(1);
        sap.ca.ui.utils.busydialog.releaseBusyDialog();
        setTimeout(function () {
            var oBusyDialog = sap.ui.getCore().byId(BUSIDIALOG_ID);
            assert.ok(oBusyDialog, "Busy Dialog is still opening");
            done();
        }, 3000);
    });

    test("Release Busy Dialog for the 2. time", function (assert) {
        var done = assert.async();
        assert.expect(1);
        setTimeout(function () {
            var oBusyDialog = sap.ui.getCore().byId(BUSIDIALOG_ID);
            var fnAttachClose = function () {
                assert.ok(true, "Busy Dialog is closed");
                oBusyDialog.detachClose(fnAttachClose);
                done();
            };
            oBusyDialog.attachClose(fnAttachClose);
            sap.ca.ui.utils.busydialog.releaseBusyDialog();
        }, 1000);
    });
});
