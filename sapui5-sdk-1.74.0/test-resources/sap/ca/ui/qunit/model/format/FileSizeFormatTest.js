window.addEventListener("load", function () {
    var oHtml = new sap.ui.core.HTML({
        content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori Wave 2: Test Page for FileSizeFormat</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>',
        afterRendering: function () {
            oLabel.placeAt("contentHolder");
        }
    });

    var page = new sap.m.Page("TestPage", {
        title: "FileSizeFormat Test",
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
//Testing Part: FileSizeFormat
///////////////

// require module to be tested
    jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");
    jQuery.sap.require("sap.ca.ui.model.format.FormatHelper");

// Alias
    var Formatter = sap.ca.ui.model.format.FileSizeFormat.getInstance();
    var Helper = sap.ca.ui.model.format.FormatHelper;

// --------------------------------------------------------------------------------
    module("fileSizeFormat");

    test("Invalid input", function () {
        equal(Formatter.format("hello"), "", 'fileSizeFormatter("hello") == ""');
    });

    test("main test", function () {
        var testScales = [{value: 1, scale: 1, suffix: ""}
            , {value: 1e3, scale: 1e3, suffix: "Kilo"}
            , {value: 1e6, scale: 1e6, suffix: "Mega"}
            , {value: 1e9, scale: 1e9, suffix: "Giga"}
            , {value: 1e12, scale: 1e12, suffix: "Tera"}
            , {value: 1e15, scale: 1e15, suffix: "Peta"}
            , {value: 1e18, scale: 1e18, suffix: "Exa"}
            , {value: 1e21, scale: 1e21, suffix: "Zetta"}
            , {value: 1e24, scale: 1e24, suffix: "Yotta"}
            , {value: 1e27, scale: 1e24, suffix: "Yotta"}
        ];
        var testValues = [1, 1.23456789, 12.3456789, 123.456789, 999, 999.9, 999.999999];
        var expected;

        // 0 byte
        expected = "0\u00A0" + sap.ca.ui.utils.resourcebundle.getText("FileSize.Byte");
        equal(Formatter.format(0), expected, "fileSizeFormat(0) == " + expected);

        for (var i = 0; i < testScales.length - 1; ++i) {
            var ref = testScales[i];
            for (var j = 0; j < testValues.length; ++j) {
                var testValue = testValues[j] * ref.value;
                var byteValue = testValue.toFixed(0);

                if (Math.abs(byteValue) < 2) {
                    expected = byteValue + "\u00A0" + sap.ca.ui.utils.resourcebundle.getText("FileSize.Byte");
                }
                else if (byteValue < 1e3) {
                    expected = byteValue + "\u00A0" + sap.ca.ui.utils.resourcebundle.getText("FileSize.Bytes");
                }
                else {
                    var next = testScales[i + 1];
                    var suffix = ref.suffix;
                    var scaledValue = (byteValue / ref.scale).toFixed(0);
                    if (scaledValue >= 1000) {
                        suffix = next.suffix;
                        scaledValue = (byteValue / next.scale);
                    }
                    else {
                        scaledValue = byteValue / ref.scale;
                    }
                    if (scaledValue < 10) {
                        expected = Helper.formatNumber(scaledValue, {decimals: 1}) + "\u00A0" + sap.ca.ui.utils.resourcebundle.getText("FileSize." + suffix + "bytes");
                    }
                    else {
                        expected = Helper.formatNumber(scaledValue, {decimals: 0}) + "\u00A0" + sap.ca.ui.utils.resourcebundle.getText("FileSize." + suffix + "bytes");
                    }

                }
                equal(Formatter.format(testValue), expected, "fileSizeFormat(" + testValue + ") == " + expected);
                equal(Formatter.format(-testValue), "-" + expected, "fileSizeFormat(-" + testValue + ") == -" + expected);
            }
        }
    });
});
