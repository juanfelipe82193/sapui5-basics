/*global define, sap */

define("zen.rt.components.infochart/js/utils/info_data_mapper", [
        "underscore",
        "zen.rt.components.infochart/js/utils/info_chart_exception"],
    function (_, InfoChartException) {

        "use strict";

        var InfoDataMapper = function () {
        };

        InfoDataMapper.prototype.map = function (flatData) {
            if (!flatData || !flatData.data || !flatData.data.length) {
                throw new InfoChartException("mapper.nodata");
            }
            return new sap.viz.api.data.FlatTableDataset(flatData);
        };

        InfoDataMapper.prototype.getMeasuresDimensionKey = function (dimensions, externalDimensions) {
            var allDimensions = dimensions || [];
            allDimensions = allDimensions.concat(externalDimensions);
            var measuresDimension = _.findWhere(allDimensions, {"containsMeasures": true});
            return measuresDimension && measuresDimension.key;
        };

        return InfoDataMapper;

    });
