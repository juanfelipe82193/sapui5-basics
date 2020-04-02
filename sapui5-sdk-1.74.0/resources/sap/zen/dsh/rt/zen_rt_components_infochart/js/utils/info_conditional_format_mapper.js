/*global define*/

define("zen.rt.components.infochart/js/utils/info_conditional_format_mapper", [
        "underscore"], function (_) {

    "use strict";

    var ConditionalFormatMapper = function () {
    };

    /**
     * Generates a cvom dataPointStyle object as defined here:
     * wiki BISHGVisualization/The+interface+of+semantic+color
     *
     * The returned object will look like:
     * { "rules": ARRAY_OF_RULES}
     * where each rule looks like:
     *
        {
            dataContext: [{ "Country": "USA"}, {"Country": "Ireland"}],
            properties: { "color": "#EACF5E"},
            displayName: "USA"
        }
     *
     * @param sdkData SdkData object
     *
     */
    ConditionalFormatMapper.prototype.createDataPointStyle = function(sdkData) {
        var conditionalFormatValues = sdkData.getConditionalFormatValues();
        var rules = _.reduce(conditionalFormatValues, function(memo, dimensionMeasureValues, conditionIndex) {
            memo.push({
                 "dataContext": dimensionMeasureValues,
                 "properties": { "color": getColor(conditionIndex) },
                 "displayName": "" + conditionIndex
            });
            return memo;
        },[]);
        return { "rules": rules };
    };

    function getColor(conditionIndex) {
        var cssClass = "sapzencrosstab-DataCellAlert" + conditionIndex + "Background";
        return getBackgroundColor(cssClass);
    }

    function getBackgroundColor(cssClass) {
        var $e = $("<div style='display:none'></div>").appendTo("body");
        $e.addClass(cssClass);
        var rgb =$e.css("background-color");
        $e.remove();
        return rgb;
    }

    return ConditionalFormatMapper;

});
