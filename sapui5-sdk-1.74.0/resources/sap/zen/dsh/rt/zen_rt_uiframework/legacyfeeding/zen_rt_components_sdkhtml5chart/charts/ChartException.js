define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/ChartException",
    [],
    function() {
        function ChartException(shortMessage, longMessage) {
            this.name = "Unexpected error";
            this.message = shortMessage;
            this.longMessage = longMessage;
        }

        ChartException.prototype = new Error();
        ChartException.prototype.constructor = ChartException;
        return ChartException
    }
);