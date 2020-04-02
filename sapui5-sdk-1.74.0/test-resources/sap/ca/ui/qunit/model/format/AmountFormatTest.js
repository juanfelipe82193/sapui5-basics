window.addEventListener("load", function () {
    var oHtml = new sap.ui.core.HTML({
        content: '<div id="contentHolder"></div><h1 id="qunit-header">Fiori Wave 2: Test Page for AmountFormat</h1><h2 id="qunit-banner"></h2><h2 id="qunit-userAgent"></h2><ol id="qunit-tests"></ol>',
        afterRendering: function () {
            oLabel.placeAt("contentHolder");
        }
    });

    var page = new sap.m.Page("TestPage", {
        title: "AmountFormat Test",
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
//Testing Part: AmountFormat
///////////////
// require module to be tested
    jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
// --------------------------------------------------------------------------------
    module("AmountFormat");
// --------------------------------------------------------------------------------
    module("AmountFormatter.formatNumber");
    test("Default options input", function () {
        sap.ui.getCore().getConfiguration().setLanguage("en");
        var formatter = sap.ca.ui.model.format.AmountFormat.getInstance();
        equal(formatter.format(1234.567), "1,234.567", "EUR.formatNumber(1234.567) == 1,234.567");

        equal(sap.ca.ui.model.format.AmountFormat.FormatAmountStandard(123.4567), "123.4567",
            "FormatAmountStandard(123.4567) == 123.4567");
    });

    test("Invalid input", function () {
        var formatter = sap.ca.ui.model.format.AmountFormat.getInstance("EUR", {style: "standard"});
        equal(formatter.format("hello"), "", 'EUR.formatNumber("hello") == ""');
        equal(formatter.format(null), "", 'EUR.formatNumber(null) == ""');
        equal(formatter.format(), "", 'EUR.formatNumber() == ""');
    });
    test("Standard currency", function () {
        var formatter = sap.ca.ui.model.format.AmountFormat.getInstance("EUR", {style: "standard"}, "en");
        equal(formatter.format(1234.567), "1,234.57", "EUR.formatNumber(1234.567) == 1,234.57");
    });
    test("Currency with non-default decimals", function () {
        var formatter = sap.ca.ui.model.format.AmountFormat.getInstance("JPY", {style: "standard"}, "en");
        equal(formatter.format(1234.567), "1,235", "JPY.formatNumber(1234.567) == 1,235");
    });

    test("Decimals overload", function () {
        var formatter = sap.ca.ui.model.format.AmountFormat.getInstance("EUR", {decimals: 3}, "en");
        equal(formatter.format(1234.567), "1,234.567", "EUR.formatNumber(1234.567, {decimals:3}) == 1,234.567");
    });

    test("Preserve", function () {
        sap.ui.getCore().getConfiguration().setLanguage("en");
        var formatter = sap.ca.ui.model.format.AmountFormat.getInstance("EUR", {
            style: "standard",
            decimals: "preserve"
        });
        equal(formatter.format(1234.567), "1,234.567", "formatNumber(1234.567,EUR,Preserve) == 1,234.567");

        equal(sap.ca.ui.model.format.AmountFormat.FormatAmountStandard(123.4567, "EUR", "preserve"), "123.4567",
            "FormatAmountStandard(123.4567,EUR,preserve) == 123.4567");

        equal(sap.ca.ui.model.format.AmountFormat.FormatAmountStandardWithCurrency(123.4567, "EUR", "preserve"), "EUR 123.4567",
            "FormatAmountStandardWithCurrency(123.4567,EUR,preserve) == EUR 123.4567");

        // cannot determine the amount of decimals if a float is given (we won't count non zero digits either.
        equal(sap.ca.ui.model.format.AmountFormat.FormatAmountStandardWithCurrency(321.000, "EUR", "preserve"), "EUR 321",
            "FormatAmountStandardWithCurrency(321,EUR,preserve) == EUR 321");

        equal(sap.ca.ui.model.format.AmountFormat.FormatAmountStandardWithCurrency("456.000", "EUR", "preserve"), "EUR 456.000",
            "FormatAmountStandardWithCurrency(\"456.000\",EUR,preserve) == EUR 456.000");
    });

// --------------------------------------------------------------------------------
    module("AmountFormatter.short style");
    test("Standard currency", function () {
        var formatter = sap.ca.ui.model.format.AmountFormat.getInstance("EUR", {style: "short"}, "en");
        equal(formatter.format(123.456), "123.46", "EUR.formatNumber(123.456, {style:short}) == 123.46");
        equal(formatter.format(123456.789), "123K", "EUR.formatNumber(123456.789, {style:short}) == 123K");
        equal(formatter.format(1234567.89), "1M", "EUR.formatNumber(1234567.89, {style:short}) == 1M");
    });
    test("Currency with non-default decimals", function () {
        var formatter = sap.ca.ui.model.format.AmountFormat.getInstance("JPY", {style: "short"}, "en");
        equal(formatter.format(123.456), "123", "JPY.formatNumber(123.456, {style:short}) == 123");
        equal(formatter.format(123456.789), "123K", "JPY.formatNumber(123456.789, {style:short}) == 123K");
        equal(formatter.format(1234567.89), "1M", "JPY.formatNumber(1234567.89, {style:short}) == 1M");
    });
    test("Decimals overload", function () {
        var formatter = sap.ca.ui.model.format.AmountFormat.getInstance("EUR", {style: "short", decimals: 0}, "en");
        equal(formatter.format(123.456), "123", "EUR.formatNumber(123.456, {style:short, decimals:0}}) == 123");
        equal(formatter.format(1234567.89), "1M", "EUR.formatNumber(1234567.89, {style:short, decimals:0}) == 1M");
    });
    test("Short decimals overload", function () {
        var formatter = sap.ca.ui.model.format.AmountFormat.getInstance("EUR", {
            style: "short",
            shortDecimals: 3
        }, "en");
        equal(formatter.format(123.4567), "123.46", "EUR.formatNumber(123.4567, {style:short, shortDecimals:3}) == 123.46");
        equal(formatter.format(999.999), "1.000K", "EUR.formatNumber(999.999, {style:short, shortDecimals:3}) == 1.000K");
        equal(formatter.format(1234.567), "1.235K", "EUR.formatNumber(1234.567, {style:short, shortDecimals:3}) == 1.235K");
        equal(formatter.format(1234567), "1.235M", "EUR.formatNumber(1234567, {style:short, shortDecimals:3}) == 1.235M");
    });
    test("Decimals and short decimals overload", function () {
        var formatter = sap.ca.ui.model.format.AmountFormat.getInstance("EUR", {
            style: "short",
            decimals: 0,
            shortDecimals: 3
        }, "en");
        equal(formatter.format(123.4567), "123", "EUR.formatNumber(123.4567, {style:short, decimals:0, shortDecimals:3}) == 123");
        equal(formatter.format(999.999), "1.000K", "EUR.formatNumber(999.999, {style:short, decimals:0,shortDecimals:3}) == 1.000K");
        equal(formatter.format(1234.567), "1.235K", "EUR.formatNumber(1234.567, {style:short, decimals:0, shortDecimals:3}) == 1.235K");
    });

    test("FormatAmountStandardWithCurrency", function () {
        // CLDR files are located in openui5\src\sap.ui.core\src\sap\ui\core\cldr
        // test a currency with a 'regular' space
        sap.ui.getCore().getConfiguration().setLanguage("en");
        equal(sap.ca.ui.model.format.AmountFormat.FormatAmountStandardWithCurrency(123.45, "EUR"), "EUR 123.45", "In en, 123.45 EUR == EUR 123.45");
        // test a currency with an unbreakable space before the currency code
        sap.ui.getCore().getConfiguration().setLanguage("fr");
        equal(sap.ca.ui.model.format.AmountFormat.FormatAmountStandardWithCurrency(123.45, "EUR"), "123,45" + "\u00a0" + "EUR", "In fr, 123.45 EUR == 123,45 EUR");

        // Test below removed on 20180702 because it is more testing the CLDR contents provided by UI5 than our code.
        // Plus, we still have the 2 tests above that do basically the same thing (including the fancy non breakable space character).

        // // test a currency with an unbreakable space after the currency code + bidi characters.
        // // 202b, 202c and 200e are unicode control characters, https://en.wikipedia.org/wiki/Unicode_control_characters#Bidirectional_text_control
        // // 00a0 => non breakable space
        // sap.ui.getCore().getConfiguration().setLanguage("ar");
        // equal(sap.ca.ui.model.format.AmountFormat.FormatAmountStandardWithCurrency(123.45, "EUR"), "\u202b" + "EUR" + "\u200e\u202c\u00a0" + "123.45", "In ar, 123.45 EUR");
    });

    test("Preserve decimals", function () {
        sap.ui.getCore().getConfiguration().setLanguage("en");

        var formatter = sap.ca.ui.model.format.AmountFormat.getInstance("EUR", {
            style: "short",
            decimals: "preserve",
            shortDecimals: 3
        });
        equal(formatter.format(123.4567), "123.4567", "EUR.formatNumber(123.4567, {style:short, decimals:preserve, shortDecimals:3}) == 123.4567");
        equal(formatter.format(123.4567), "123.4567", "EUR.formatNumber(123.4567, {style:short, decimals:preserve, shortDecimals:3}) == 123.4567");
        equal(formatter.format(999.999), "999.999", "EUR.formatNumber(999.999, {style:short, decimals:preserve,shortDecimals:3}) == 999.999");
        equal(formatter.format(1234.567), "1.235K", "EUR.formatNumber(1234.567, {style:short, decimals:preserve, shortDecimals:3}) == 1.235K");

        equal(sap.ca.ui.model.format.AmountFormat.FormatAmountShort(123.4567), "123.4567",
            "FormatAmountShort(123.4567) == 123.4567");

        equal(sap.ca.ui.model.format.AmountFormat.FormatAmountShort(123.4567, "EUR", "preserve"), "123.4567",
            "FormatAmountShort(123.4567,EUR,preserve) == 123.4567");

        equal(sap.ca.ui.model.format.AmountFormat.FormatAmountShort(1234.5678, "EUR", "preserve"), "1K",
            "FormatAmountShort(1234.5678,EUR,preserve) == 1K");

        equal(sap.ca.ui.model.format.AmountFormat.FormatAmountShortWithCurrency(123.4567, "EUR", "preserve"), "EUR 123.4567",
            "FormatAmountShortWithCurrency(123.4567,EUR,preserve) == EUR 123.4567");

        equal(sap.ca.ui.model.format.AmountFormat.FormatAmountShortWithCurrency(1234.5678, "EUR", "preserve"), "EUR 1K",
            "FormatAmountShortWithCurrency(1234.5678,EUR,preserve) == EUR 1K");
    });

    test("There should be no decimals in JPY (regression)", function () {
        // Internal Issue: 1482007051
        var projectRate = "20.45";

        var amountFormat = sap.ca.ui.model.format.AmountFormat.getInstance("JPY", null, sap.ui.getCore().getConfiguration().getLocale().getLanguage());
        strictEqual(amountFormat.format(projectRate), "20", "JPY format is incorrect");
    });
});
