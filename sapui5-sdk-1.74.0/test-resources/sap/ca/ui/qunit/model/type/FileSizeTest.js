window.addEventListener("load", function () {
    var oHtml = new sap.ui.core.HTML({
        content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori Wave 2: Test Page for FileSize</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>',
        afterRendering: function () {
            oLabel.placeAt("contentHolder");
        }
    });

    var page = new sap.m.Page("TestPage", {
        title: "FileSize Test",
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
//Testing Part: FileSize type
///////////////

// require module to be tested
    jQuery.sap.require("sap.ca.ui.model.type.FileSize");

// Alias
    var FileSize = new sap.ca.ui.model.type.FileSize();


// --------------------------------------------------------------------------------
    module("FileSizeType");

    test("formatValue to string", function () {
        equal(FileSize.formatValue("340", "string"), "340\u00A0Bytes", 'formatValue("340", "string") == "340 Bytes"');
    });

    test("formatValue to int", function () {
        equal(FileSize.formatValue(340, "int"), 340, 'formatValue("340", "int") == "340"');
    });

    test("formatValue to float", function () {
        equal(FileSize.formatValue(40, "float"), 40, 'formatValue("40", "float") == "40"');
    });


    test("parseValue from string", function () {
        equal(FileSize.parseValue("340", "string"), "340", 'parseValue("340") == "340"');
    });


    test("validateValue Good", function () {
        equal(FileSize.validateValue(340), undefined, 'validateValue(340) == undefined');
    });
});
