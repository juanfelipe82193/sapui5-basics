window.addEventListener("load", function () {

    // require dialog module
    jQuery.sap.require("sap.ca.ui.dialog.Dialog");

    var oHtml = new sap.ui.core.HTML({
        content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori Wave 2: Test Page for Fiori Dialog</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>'
    });

    var page = new sap.m.Page("myFirstPage", {
        title: "Fiori - Dialog",
        showNavButton: true,
        enableScrolling: true,
        content: oHtml
    });

    var app = new sap.m.App("myApp", {
        initialPage: "myFirstPage"
    });

    app.addPage(page).placeAt("content");

    ///////////////
    //Testing Part
    ////////////////
    module("Dialog - Object Create");

    test("Object Creation with Id", function () {
        var oDialog = new sap.ca.ui.dialog.Dialog("id", {});
        strictEqual(oDialog.getId(), "id", "Dialog has ID 'id'");
        ok(!oDialog.getXMLView(), "XMLView is not set");
    });

    var CONFIRMDLG_VIEW_NAME = "sap.ca.ui.dialog.Confirm"; //it should be a real XMLView name
    var DIALOG_ID = "DLG_CONFIRM";//it should be a real DialogID in the view
    test("Object Creation with Id and XMLView", function () {
        var oDialog = new sap.ca.ui.dialog.Dialog(DIALOG_ID, {
            xmlViewId: "viewId",
            xmlViewName: CONFIRMDLG_VIEW_NAME
        });
        strictEqual(oDialog.getId(), DIALOG_ID, "Dialog has ID 'id'");
        ok(oDialog.getXMLView(), "Dialog has a XMLView");
        ok(oDialog.getDialog(), "Dialog has been created");
    });
});
