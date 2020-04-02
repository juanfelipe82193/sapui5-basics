window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.ca.ui.InPlaceEdit");


    var oHtml = new sap.ui.core.HTML(
        {
            content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori Wave 2: Test Page for Notes</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>',
            afterRendering: function () {
                oIPE.placeAt("contentHolder");
            }
        });


    var oInput = new sap.m.Input({value: "My InPlaceEdit value"});
    var oIPE = new sap.ca.ui.InPlaceEdit("inplaceedit", {content: oInput});


    var page = new sap.m.Page("myFirstPage", {
        title: "Fiori - InPlace Edit Test",
        showNavButton: false,
        enableScrolling: true,
        content: oHtml
    });

    var app = new sap.m.App("myApp", {
        initialPage: "myFirstPage"
    });

    app.addPage(page).placeAt("content");

    ///////////////
    //Testing Part: InPlace Edit
    ///////////////
    module("InPlace Edit - Object Create");


    test("Object Creation with Id", function () {
        strictEqual(oIPE.getId(), "inplaceedit", "IPE control has ID 'inplaceedit'");
    });

    test("Data renders properly", function () {
        var $span = jQuery.sap.byId(oIPE.getId() + "--TV");
        ok($span, "InPlaceEdit readonly should be rendered");
    });
});
