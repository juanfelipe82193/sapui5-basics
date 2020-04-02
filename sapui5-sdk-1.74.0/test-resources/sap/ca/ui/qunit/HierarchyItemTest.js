window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.ca.ui.HierarchyItem");

    var oHtml = new sap.ui.core.HTML(
        {
            content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori Wave 2: Test Page for HierarchyItem</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>',
            afterRendering: function () {
                oHierarchyItem.placeAt("contentHolder");
            }
        });

    var page = new sap.m.Page("myFirstPage", {
        title: "Fiori - HierarchyItem Test",
        showNavButton: true,
        enableScrolling: true,
        content: oHtml
    });

    var oHierarchyItem = new sap.ca.ui.HierarchyItem({
        id: "HierarchyItem",
        identifire: 1234,
        title: "Test",
        activity: "test",
        link: "Test the link"
    });

    var app = new sap.m.App("myApp", {
        initialPage: "myFirstPage"
    });

    app.addPage(page).placeAt("content");

///////////////
//Testing Part: HierarchyItem
///////////////
    var HIERARCHYITEM_ID = "CA_VIEW_HIERARCHYITEM--HIERARCHYITEM";

    module("HierarchyItem - Object Create");

    test("Object Creation with Id", function () {
        var oHierarchyItem = new sap.ca.ui.HierarchyItem("id", {});
        strictEqual(oHierarchyItem.getId(), "id", "HierarchyItem has ID 'id'");
    });

    test("Press HierarchyItem", function () {
        var msg = "";
        oHierarchyItem.attachLinkPress(function () {
            msg = "pressed";
        });
        oHierarchyItem.fireLinkPress();
        ok(msg == "pressed", "Fire LinkPress event is ok", "Fire Link Press event not thrown");
    });
});
