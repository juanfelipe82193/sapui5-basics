window.addEventListener("load", function () {
    var oHtml = new sap.ui.core.HTML({
        content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori Wave 2: Test Page for Number</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>',
        afterRendering: function () {
            oLabel.placeAt("contentHolder");
        }
    });

    var page = new sap.m.Page("TestPage", {
        title: "Number Test",
        showNavButton: true,
        enableScrolling: true,
        content: oHtml
    });

    var oLabel = new sap.m.Label({text: "Test"});


    var app = new sap.m.App("TestApp", {
        initialPage: "TestPage"
    });

    app.addPage(page).placeAt("content");

///////////////
//Testing Part: Number type
///////////////

// require module to be tested
    jQuery.sap.require("sap.ca.ui.model.type.Number");

    function getSapCaUiNumber() {
        return new sap.ca.ui.model.type.Number();
    }


// --------------------------------------------------------------------------------
    module("NumberType");

    test("formatValue to string", function () {
        equal(getSapCaUiNumber().formatValue("340", "string"), "340", 'formatValue("340", "string") == "340"');
    });

    test("formatValue to int", function () {
        equal(getSapCaUiNumber().formatValue(340, "int"), 340, 'formatValue("340", "int") == "340"');
    });

    test("formatValue to float", function () {
        equal(getSapCaUiNumber().formatValue(40, "float"), 40, 'formatValue("40", "float") == "40"');
    });


    test("parseValue from string", function () {
        equal(getSapCaUiNumber().parseValue("340", "string"), "340", 'parseValue("340") == "340"');
    });


    test("validateValue Good", function () {
        equal(getSapCaUiNumber().validateValue(340), undefined, 'validateValue(340) == undefined');
    });
});
