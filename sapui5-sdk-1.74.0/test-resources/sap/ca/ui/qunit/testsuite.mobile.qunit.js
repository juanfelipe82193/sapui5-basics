(function () {
    "use strict";

    window.suite = function () {
        var aTests = [
            "AddPicture",
            "CustomerContext",
            "DatePicker",
            "FileUpload",
            "Hierarchy",
            "HierarchyItem",
            "InPlaceEdit",
            "Notes",
            "PictureItem",
            "OverflowContainer",
            "UI5Private",
            "dialog/Dialog",
            "dialog/confirmation",
            "dialog/forward",
            "message/message",
            "utils/busydialog",
            "utils/Lessifier",
            "utils/resourcebundle",
            "model/format/AmountFormat",
            "model/format/DateFormat",
            "model/format/FileSizeFormat",
            "model/format/FormatHelper",
            "model/format/FormattingLibrary",
            "model/format/NumberFormat",
            "model/format/QuantityFormat",
            "model/type/FileSize",
            "model/type/Number",
            "charts/BubbleChart",
            "charts/CombinedChart",
            "charts/horizontalBarChart",
            "charts/lineChart",
            "charts/verticalBarChart",
            "charts/StackedVerticalColumnChart",
            "charts/StackedHorizontalBarChart"
        ];


        var oSuite = new parent.jsUnitTestSuite();
        var contextPath = "/" + window.location.pathname.split("/")[1];

        for (var i = 0; i < aTests.length; i++) {
            oSuite.addTestPage(contextPath + "/test-resources/sap/ca/ui/qunit/" + aTests[i] + ".qunit.html?sap-ui-language=en&sap-ui-qunittimeout=20000");
        }

        return oSuite;
    };

})();

