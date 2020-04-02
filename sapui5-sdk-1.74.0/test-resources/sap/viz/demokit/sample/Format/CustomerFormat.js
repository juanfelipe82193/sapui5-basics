sap.ui.define([
       'sap/ui/core/format/DateFormat',
       'sap/ui/core/format/NumberFormat',
       'sap/viz/ui5/format/ChartFormatter',
       'sap/viz/ui5/api/env/Format'
   ], function(DateFormat, NumberFormat, ChartFormatter,Format) {
    "use strict";

    return {
        FIORI_LABEL_PERCENTAGEFORMAT_1: "__UI5_FloatmaxFraction1",
        FIORI_LEVEL_DAY: "__UI5_Date_day",
        FIORI_LEVEL_MONTH: "__UI5_Date_month",
        chartFormatter : null,
        registerCustomFormat: function() {
            var chartFormatter = this.chartFormatter = ChartFormatter.getInstance();
            chartFormatter.registerCustomFormatter(this.FIORI_LABEL_PERCENTAGEFORMAT_1, function(value) {
                var fixedFloat = NumberFormat.getPercentInstance({
                    style: "standard",
                    decimals: 1
                });
                return fixedFloat.format(value);
            });
            chartFormatter.registerCustomFormatter(this.FIORI_LEVEL_DAY, function(value) {
                var dateFormatter = DateFormat.getDateTimeInstance({
                                pattern: 'MM/dd'});
                return dateFormatter.format(value);
            });
            chartFormatter.registerCustomFormatter(this.FIORI_LEVEL_MONTH, function(value) {
                var dateFormatter = DateFormat.getDateInstance({
                                format: 'MMMMM'});
                return dateFormatter.format(value);
            });
            Format.numericFormatter(chartFormatter);
        }
    };
});