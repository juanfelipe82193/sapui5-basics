window.addEventListener("load", function () {
    var oHtml = new sap.ui.core.HTML({
        content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori Wave 2: Test Page for FormattingLibrary</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>',
        afterRendering: function () {
            oLabel.placeAt("contentHolder");
        }
    });

    var page = new sap.m.Page("TestPage", {
        title: "FormattingLibrary Test",
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
//Testing Part: FormattingLibrary
///////////////

// require module to be tested
    jQuery.sap.require("sap.ca.ui.model.format.FormattingLibrary");
    jQuery.sap.require("sap.ca.ui.model.format.FormatHelper");

// Alias
    var Formatter = sap.ca.ui.model.format.FormattingLibrary;

// --------------------------------------------------------------------------------
    module("FormattingLibrary");

    test("formatAttachmentIcon", function () {

        var testValues = [
            {name: "default test", param: "default", expectedResult: "sap-icon://document"},
            {name: "valid test", param: "application/x-shockwave-flash", expectedResult: "sap-icon://attachment-video"},

            {name: "null test", param: null, expectedResult: "sap-icon://document"},
            {name: "undefined test", param: undefined, expectedResult: "sap-icon://document"}
        ];

        for (var j = 0; j < testValues.length; ++j) {
            var testValue = testValues[j];

            equal(Formatter.formatAttachmentIcon(testValues[j].param), testValues[j].expectedResult, testValues[j].name + "('" + testValues[j].param + "') == " + testValues[j].expectedResult);
        }

    });

// --------------------------------------------------------------------------------
    module("FormattingLibrary");

    test("formatAttachmentTitle", function () {

        var sDescription = "Description";
        var sFileType = "FileType";

        var testValues = [
            {name: "valid p1", param1: sDescription, param2: null, expectedResult: sDescription},
            {name: "valid p2", param1: null, param2: sFileType, expectedResult: sFileType},
            {name: "valid p1 + p2", param1: sDescription, param2: sFileType, expectedResult: sDescription},

            {name: "null test", param1: null, param2: null, expectedResult: null},
            {name: "undefined test", param1: undefined, param2: undefined, expectedResult: undefined}
        ];

        for (var j = 0; j < testValues.length; ++j) {
            var testValue = testValues[j];

            equal(Formatter.formatAttachmentTitle(testValues[j].param1, testValues[j].param2), testValues[j].expectedResult, testValues[j].name + "('" + testValues[j].param1 + "','" + testValues[j].param2 + "') == " + testValues[j].expectedResult);
        }

    });

// --------------------------------------------------------------------------------
    module("FormattingLibrary");

    test("formatStatus", function () {

        var testValues = [
            {name: "warning", param: "1", expectedResult: sap.ui.core.ValueState.Warning},
            {name: "success", param: "2", expectedResult: sap.ui.core.ValueState.Success},
            {name: "error", param: "3", expectedResult: sap.ui.core.ValueState.Error},

            {name: "missing", param: "4", expectedResult: sap.ui.core.ValueState.None},
            {name: "invalid", param: "invalid", expectedResult: sap.ui.core.ValueState.None},
            {name: "null test", param: null, expectedResult: sap.ui.core.ValueState.None},
            {name: "undefined test", param: undefined, expectedResult: sap.ui.core.ValueState.None}
        ];

        for (var j = 0; j < testValues.length; ++j) {
            equal(Formatter.formatStatus(testValues[j].param), testValues[j].expectedResult, testValues[j].name + "('" + testValues[j].param + "') == " + testValues[j].expectedResult);
        }

    });

// --------------------------------------------------------------------------------
    module("FormattingLibrary");

    test("commonIDFormatter", function () {
        var sDescription = "Description";
        var sID = "ID";
        var sEmpty = "";
        var sCombined = sDescription + " (" + sID + ")";

        var testValues = [
            {name: "valid p1", param1: sDescription, param2: null, expectedResult: sDescription},
            {name: "valid p2", param1: null, param2: sID, expectedResult: sID},
            {name: "valid p1 + p2", param1: sDescription, param2: sID, expectedResult: sCombined},

            {name: "null test", param1: null, param2: null, expectedResult: sEmpty},
            {name: "undefined test", param1: undefined, param2: undefined, expectedResult: sEmpty}
        ];

        for (var j = 0; j < testValues.length; ++j) {
            var testValue = testValues[j];

            equal(Formatter.commonIDFormatter(testValues[j].param1, testValues[j].param2), testValues[j].expectedResult, testValues[j].name + "('" + testValues[j].param1 + "','" + testValues[j].param2 + "') == " + testValues[j].expectedResult);
        }
    });
});
