window.addEventListener("load", function () {
    // require resourcebundle
    jQuery.sap.require("sap.ca.ui.utils.resourcebundle");

    var oHtml = new sap.ui.core.HTML({
        content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori: Test Page for Quick Overview</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>',
        afterRendering: function () {
            oHorizontal.placeAt("contentHolder");
        }
    });

    var page = new sap.m.Page("myFirstPage", {
        title: "Fiori - Testing Quick Overview",
        showNavButton: true,
        enableScrolling: true,
        content: oHtml
    });

    var oHorizontal = new sap.m.HBox({
        //buttons defined in EmployeeBusinessCardTest.js and CompanyBusinessCardTest.js
        items: [oEmployeeBusinessCard, oCompanyBusinessCard] //, oQuickOverview]
    });

    var app = new sap.m.App("myApp", {
        initialPage: "myFirstPage"
    });

    app.addPage(page).placeAt("content");
});
