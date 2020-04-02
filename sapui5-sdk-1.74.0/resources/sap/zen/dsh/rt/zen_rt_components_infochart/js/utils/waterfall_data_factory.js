/* global define */

define("zen.rt.components.infochart/js/utils/waterfall_data_factory", ["underscore"],
        function(_) {

    "use strict";

    function transformData(flatData, enrichData) {
        flatData.metadata.fields.push({
            "id": "Type",
            "name": "Type",
            "semanticType": "Dimension",
            "dataType": "String",
            "type": "Dimension"
        });
        if (enrichData.length > 0) {
            withEnrichDataTransform(flatData, enrichData);
        }
        return flatData;
    }

    function isNeeded(chartType) {
        var allowedTypes = ['info/waterfall'];
        return _.indexOf(allowedTypes, chartType) >= 0;
    }

    function withEnrichDataTransform(flatData, enrichData) {
        _.forEach(flatData.data, function(data) {
            var isTotal = _.some(enrichData, function(rData) {
                var setTotals = true,
                    myTempHolder = [];
                _.forEach(data, function(value, i) {
                    if (_.isObject(value)) {
                        var totalCheck = {};
                        totalCheck[flatData.metadata.fields[i].id] = value.v;
                        myTempHolder.push(value);
                        if (!isMatch(rData, totalCheck)) {
                            setTotals = false;
                        }
                    } else {
                        myTempHolder.push(value);
                    }
                });
                myTempHolder = [];
                return setTotals;
            });

            data.push(isTotal ? "total" : "null");
        });

    }

    function isMatch(object, attrs) {
        var keys = _.keys(attrs),
            length = keys.length;
        if (object === null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
    }

    return {
        "transformData": transformData,
        "isNeeded": isNeeded
    };
});
