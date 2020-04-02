window.addEventListener("load", function () {
    // require dialog module and
    jQuery.sap.require("sap.ca.ui.dialog.factory");
    // require resourcebundle
    jQuery.sap.require("sap.ca.ui.utils.resourcebundle");

    var oHtml = new sap.ui.core.HTML({
        content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori Wave 2: Test Page for Login Details</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>',
        afterRendering: function () {
            oHorizontal.placeAt("contentHolder");
        }
    });

    var page = new sap.m.Page("myFirstPage", {
        title: "Fiori - Testing Dialogs",
        showNavButton: true,
        enableScrolling: true,
        content: oHtml
    });

    var fnClose = function () {
        //set Dialog is closed
        qunithelper.bg_IsDialogClosed = true;
    };
    var oBTNAbout = new sap.m.Button({
        text: "Open About Dialog",
        press: function () {
            sap.ca.ui.dialog.factory.showAbout({
                appIcon: "../../sap/ca/ui/images/72_iPad_Desktop_Launch.png",
                appName: "Approve Shopping Cart",
                artefact: "sap.srm.shoppingcart.approve",
                version: "1.0.0",
                build: "234567 (2013-08-08_14-00-30)",
                ui5Version: "1.15.0"
            }, fnClose);
        }
    });

    var oBTNLogin = new sap.m.Button({
        text: "Open LoginDetails Dialog",
        press: function () {
            sap.ca.ui.dialog.factory.showLoginDetails({
                user: "Vivek Vishal (VISHAL)",
                server: "someserver:50026",
                language: "English (United States)"
            }, fnClose);
            qunithelper.bg_IsDialogClosed = false;
        }
    });

    var fnConfirmClose = function (oResult) {
        //set Dialog is closed
        qunithelper.bg_IsDialogClosed = true;
        if (oResult) {
            jQuery.sap.log.info("ConfirmDialog - isConfirmed: " + oResult.isConfirmed);
            if (oResult.sNote) {
                jQuery.sap.log.info("ConfirmDialog - note: " + oResult.sNote);
            }
        }
    };

    var oBTNConfirm = new sap.m.Button({
        text: "Open Confirm Dialog",
        press: function () {
            sap.ca.ui.dialog.confirmation.open({
                question: "Send your decision on the shopping card submitted by Henry Emerald?",
                showNote: true,
                title: "Send",
                confirmButtonLabel: "Send"
            }, fnConfirmClose);
        }
    });


    var oHorizontal = new sap.m.HBox({
        items: [oBTNAbout, oBTNLogin, oBTNConfirm, oBTNForward]
    });

    var app = new sap.m.App("myApp", {
        initialPage: "myFirstPage"
    });

    app.addPage(page).placeAt("content");
});
