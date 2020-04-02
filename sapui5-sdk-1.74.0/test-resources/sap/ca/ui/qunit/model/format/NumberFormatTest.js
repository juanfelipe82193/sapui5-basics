window.addEventListener("load", function () {
    var oHtml = new sap.ui.core.HTML({
        content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori Wave 2: Test Page for NumberFormat</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>',
        afterRendering: function () {
            oLabel.placeAt("contentHolder");
        }
    });

    var page = new sap.m.Page("TestPage", {
        title: "NumberFormat Test",
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
//Testing Part: NumberFormat
///////////////


// require module to be tested
    jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
    jQuery.sap.require("sap.ca.ui.model.format.FormatHelper");

    sap.ui.getCore().getConfiguration().setLanguage("en");

// Formatter Aliases
    var DefaultFormatter = sap.ca.ui.model.format.NumberFormat.getInstance(/*{style:"standard"}*/); // default options
    var StandardFormatter = sap.ca.ui.model.format.NumberFormat.getInstance({style: "standard"});
    var ShortFormatter = sap.ca.ui.model.format.NumberFormat.getInstance({style: "short"});

// Decimals
    var StandardFormatter2D = sap.ca.ui.model.format.NumberFormat.getInstance({style: "standard", decimals: 2});

// Short Decimals
    var ShortFormatter3D3SD = sap.ca.ui.model.format.NumberFormat.getInstance({
        style: "short",
        decimals: 3,
        shortDecimals: 3
    });
    var ShortFormatter2SD = sap.ca.ui.model.format.NumberFormat.getInstance({style: "short", shortDecimals: 2});

    var FRFormatter = sap.ca.ui.model.format.NumberFormat.getInstance({}, new sap.ui.core.Locale("fr"));
    var DEFormatter = sap.ca.ui.model.format.NumberFormat.getInstance({}, new sap.ui.core.Locale("de"));

//short formatter japanes
    var JAShortFormatter = sap.ca.ui.model.format.NumberFormat.getInstance({style: "short"}, new sap.ui.core.Locale("ja"));

    var Helper = sap.ca.ui.model.format.FormatHelper;
    var testRounding = [{value: 1, scale: 1, suffix: ""}
        , {value: 1e3, scale: 1e3, suffix: "K"}
        , {value: 1e6, scale: 1e6, suffix: "M"}
        , {value: 1e9, scale: 1e9, suffix: "B"}
        , {value: 1e12, scale: 1e12, suffix: "T"}
        , {value: 1e15, scale: 1e12, suffix: "T"}
        , {value: 1e18, scale: 1e12, suffix: "T"}
    ];
    var testValues = [1, 1.23456789, 12.3456789, 123.456789, 999, 999.9, 999.999999];

// --------------------------------------------------------------------------------
    module("NumberFormat");

    test("Invalid input", function () {
        equal(StandardFormatter.format("hello"), "", 'numberFormat("hello") == ""');
        equal(StandardFormatter.format(null), "", 'numberFormat(null) == ""');
        equal(StandardFormatter.format(), "", 'numberFormat() == ""');
    });

    test("default format", function () {

        for (var i = 0; i < testRounding.length - 1; ++i) {
            var ref = testRounding[i];
            for (var j = 0; j < testValues.length; ++j) {
                var testValue = testValues[j] * ref.value;
                var expected = Helper.formatNumber(testValue);

                equal(DefaultFormatter.format(testValue), expected, "numberFormatPositive(" + testValue + ") == " + expected);
                equal(DefaultFormatter.format(-testValue), "-" + expected, "numberFormatNegative(-" + testValue + ") == -" + expected);
            }
        }
    });

    test("standard format", function () {

        for (var i = 0; i < testRounding.length - 1; ++i) {
            var ref = testRounding[i];
            for (var j = 0; j < testValues.length; ++j) {
                var testValue = testValues[j] * ref.value;
                var expected = Helper.formatNumber(testValue);

                equal(StandardFormatter.format(testValue), expected, "numberFormatPositive(" + testValue + ") == " + expected);
                equal(StandardFormatter.format(-testValue), "-" + expected, "numberFormatNegative(-" + testValue + ") == -" + expected);
            }
        }
    });

    test("standard format 2D", function () {

        for (var i = 0; i < testRounding.length - 1; ++i) {
            var ref = testRounding[i];
            for (var j = 0; j < testValues.length; ++j) {
                var testValue = testValues[j] * ref.value;
                var expected = Helper.formatNumber(testValue, {decimals: 2});

                equal(StandardFormatter2D.format(testValue), expected, "numberFormatPositive(" + testValue + ") == " + expected);
                equal(StandardFormatter2D.format(-testValue), "-" + expected, "numberFormatNegative(-" + testValue + ") == -" + expected);
            }
        }
    });

    test("short format", function () {

        for (var i = 0; i < testRounding.length - 1; ++i) {
            var ref = testRounding[i];
            for (var j = 0; j < testValues.length; ++j) {
                var testValue = testValues[j] * ref.value;
                var expected;

                if (testValue < 1e3) {
                    expected = Helper.formatNumber(testValue);
                }
                else {
                    var next = testRounding[i + 1];
                    var shortValue = testValue / ref.scale;
                    var roundedValue = shortValue.toFixed(0);
                    if (roundedValue >= 1000) {
                        expected = Helper.formatNumber(testValue / next.scale, {decimals: 0}) + next.suffix;
                    }
                    else {
                        expected = Helper.formatNumber(testValue / ref.scale, {decimals: 0}) + ref.suffix;
                    }
                }
                equal(ShortFormatter.format(testValue), expected, "numberFormatPositive(" + testValue + ") == " + expected);
                equal(ShortFormatter.format(-testValue), "-" + expected, "numberFormatNegative(-" + testValue + ") == -" + expected);
            }
        }
    });

    test("short format 3D 3SD", function () {

        for (var i = 0; i < testRounding.length - 1; ++i) {
            var ref = testRounding[i];
            for (var j = 0; j < testValues.length; ++j) {
                var testValue = testValues[j] * ref.value;
                var expected;
                if (testValue.toFixed(3) < 1e3) {
                    expected = Helper.formatNumber(testValue, {decimals: 3});
                }
                else {
                    var next = testRounding[i + 1];
                    var roundedValue = (testValue / ref.scale).toFixed(1);
                    if (roundedValue >= 1000) {
                        expected = Helper.formatNumber(testValue / next.scale, {decimals: 3}) + next.suffix;
                    }
                    else {
                        expected = Helper.formatNumber(testValue / ref.scale, {decimals: 3}) + ref.suffix;
                    }
                }
                equal(ShortFormatter3D3SD.format(testValue), expected, "numberFormatPositive(" + testValue + ") == " + expected);
                equal(ShortFormatter3D3SD.format(-testValue), "-" + expected, "numberFormatNegative(-" + testValue + ") == -" + expected);
            }
        }
    });


    test("short format 2SD", function () {

        for (var i = 0; i < testRounding.length - 1; ++i) {
            var ref = testRounding[i];
            for (var j = 0; j < testValues.length; ++j) {
                var testValue = testValues[j] * ref.value;
                var expected;
                if (testValue < 1e3) {
                    expected = Helper.formatNumber(testValue);
                }
                else {
                    var next = testRounding[i + 1];
                    var roundedValue = (testValue / ref.scale).toFixed(1);
                    if (roundedValue >= 1000) {
                        expected = Helper.formatNumber(testValue / next.scale, {decimals: 2}) + next.suffix;
                    }
                    else {
                        expected = Helper.formatNumber(testValue / ref.scale, {decimals: 2}) + ref.suffix;
                    }
                }
                equal(ShortFormatter2SD.format(testValue), expected, "numberFormatPositive(" + testValue + ") == " + expected);
                equal(ShortFormatter2SD.format(-testValue), "-" + expected, "numberFormatNegative(-" + testValue + ") == -" + expected);
            }
        }
    });

    test("french format", function () {

        for (var i = 0; i < testRounding.length - 1; ++i) {
            var ref = testRounding[i];
            for (var j = 0; j < testValues.length; ++j) {
                var testValue = testValues[j] * ref.value;
                var expected = Helper.formatNumber(testValue, {locale: "fr"});

                equal(FRFormatter.format(testValue), expected, "numberFormatPositive(" + testValue + ") == " + expected);
                equal(FRFormatter.format(-testValue), "-" + expected, "numberFormatNegative(-" + testValue + ") == -" + expected);
            }
        }
    });

    test("german format", function () {

        for (var i = 0; i < testRounding.length - 1; ++i) {
            var ref = testRounding[i];
            for (var j = 0; j < testValues.length; ++j) {
                var testValue = testValues[j] * ref.value;
                var expected = Helper.formatNumber(testValue, {locale: "de"});

                equal(DEFormatter.format(testValue), expected, "numberFormatPositive(" + testValue + ") == " + expected);
                equal(DEFormatter.format(-testValue), "-" + expected, "numberFormatNegative(-" + testValue + ") == -" + expected);
            }
        }
    });

    test("japanese short format", function () {
        //japanese short format is based on powers of 10000
        equal(JAShortFormatter.format(1.23), "1.23", "JAShortFormatter(1.23) == 1.23");
        equal(JAShortFormatter.format(12.34), "12.34", "JAShortFormatter(12.34) == 12.34");
        equal(JAShortFormatter.format(123.45), "123.45", "JAShortFormatter(123.45) == 123.45");
        equal(JAShortFormatter.format(1234.56), "1,234.56", "JAShortFormatter(1234.56) == 1234.56");
        equal(JAShortFormatter.format(12345.67), "1\u4E07", "JAShortFormatter(12345.67) == 1\u4E07");
        equal(JAShortFormatter.format(123456.78), "12\u4E07", "JAShortFormatter(123456.78) == 12\u4E07");
        equal(JAShortFormatter.format(1234567.89), "123\u4E07", "JAShortFormatter(1234567.89) == 123\u4E07");
        equal(JAShortFormatter.format(12345678.90), "1,235\u4E07", "JAShortFormatter(12345678.90) == 1,235\u4E07");
        equal(JAShortFormatter.format(123456789.01), "1\u5104", "JAShortFormatter(123456789.01) == 1\u5104");
        equal(JAShortFormatter.format(1234567890.12), "12\u5104", "JAShortFormatter(1234567890.12) == 12\u5104");
        equal(JAShortFormatter.format(12345678901.23), "123\u5104", "JAShortFormatter(12345678901.23) == 123\u5104");
        equal(JAShortFormatter.format(123456789012.34), "1,235\u5104", "JAShortFormatter(123456789012.34) == 1,235\u5104");
        equal(JAShortFormatter.format(1234567890123.45), "1\u5146", "JAShortFormatter(1234567890123.45) == 1\u5146");
        equal(JAShortFormatter.format(12345678901234.56), "12\u5146", "JAShortFormatter(12345678901234.56) == 12\u5146");
        equal(JAShortFormatter.format(123456789012345.67), "123\u5146", "JAShortFormatter(123456789012345.67) == 123\u5146");
        equal(JAShortFormatter.format(1234567890123456.78), "1,235\u5146", "JAShortFormatter(1234567890123456.78) == 1,235\u5146");
    });

    test("percentage format", function () {
        var testValue = 0.1234;
        var PercentFormatter = sap.ca.ui.model.format.NumberFormat.getInstance({style: "percentage"}, new sap.ui.core.Locale("en"));
        var PercentFormatterWith2Dec = sap.ca.ui.model.format.NumberFormat.getInstance({
            style: "percentage",
            decimals: 2
        }, new sap.ui.core.Locale("en"));
        var expected = Helper.formatNumber(12.34, {decimals: 0, locale: "en"});
        var expected2Dec = Helper.formatNumber(12.34, {decimals: 2, locale: "en"});
        equal(PercentFormatter.format(testValue), expected + "\u0025", "PercentFormatter.format(12.34) no decimals set +  == " + expected + "\u0025");
        equal(PercentFormatterWith2Dec.format(testValue), expected2Dec + "\u0025", "PercentFormatter.format(12.34) with two decimals +  == " + expected2Dec + "\u0025");
    });

    test("parsing", function () {
        //english locale
        var parser = sap.ca.ui.model.format.NumberFormat.getInstance({style: 'standard'}, new sap.ui.core.Locale("en"));
        equal(parser.parse("1,234,567.89"), 1234567.89, "locale en : parse(1,234,567.89) == 1234567.89");
        // Adapt to Git commit eeae4fe6ccc9c16f6619296aad80f66ef1aa4e5d
        equal(parser.parse("1 234 567.89"), 1234567.89, "locale en : parse(1 234 567.89) == 1234567.89");
        equal(isNaN(parser.parse("I'm not a number")), true, "locale en : parse(I'm not a number) == NaN");

        //french locale
        parser = sap.ca.ui.model.format.NumberFormat.getInstance({style: 'standard'}, new sap.ui.core.Locale("fr"));
        equal(parser.parse("1 234 567,89"), 1234567.89, "locale fr : parse(1 234 567,89) == 1234567.89 - with regular spaces");
        equal(parser.parse("1" + "\u00a0" + "234" + "\u00a0" + "567,89"), 1234567.89, "locale fr : parse(1 234 567,89) == 1234567.89  - with non breaking spaces");
        equal(isNaN(parser.parse("1,234,567.89")), true, "locale fr : parse(1,234,567.89) == NaN");
        equal(isNaN(parser.parse("Je ne suis pas un nombre")), true, "locale fr : parse(Je ne suis pas un nombre) == NaN");
    });

    test("Regression Id4019bf373d32035a8061baa59a436e55f1872ea", function () {
        //english locale
        var formatter = sap.ca.ui.model.format.NumberFormat.getInstance({
            style: 'standard',
            decimals: 2
        }, new sap.ui.core.Locale("en"));
        equal(formatter.format(1234), "1,234.00", "locale en : format(1,234.00) == 1,234.00");

        formatter = sap.ca.ui.model.format.NumberFormat.getInstance({
            style: 'short',
            shortDecimals: 2
        }, new sap.ui.core.Locale("en"));
        equal(formatter.format(1000), "1.00K", "locale en : format(1,000.00) == 1.00K");
    });
});
