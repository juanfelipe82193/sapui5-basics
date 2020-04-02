/*global define, sap */
define("zen.rt.components.infochart/js/utils/info_binding_service", [
    "underscore",
    "zen.rt.components.infochart/js/utils/info_chart_exception"],
        function (_, InfoChartException) {

    "use strict";

    function convertFeedItemsToBindings(feedItems, measureIDs) {
        return _.map(feedItems, function (item) {
            return {
                "feed": item.id,
                "source": _.map(item.values, function (val) {
                    if (val.type === "MND") {
                        return {"measureNames": measureIDs};
                    } else {
                        return val.id;
                    }
                })
            };
        });
    }


    function generateFeedItems(bindings, bindingDefinition, measureIDs) {

        var typeToDataTypeMap = {
            "Dimension": "String",
            "Measure": "Number"
        };

        return _.map(bindingDefinition, function (defn) {
            var binding = _.findWhere(bindings, {feed: defn.id});
            var values = [];
            if (binding && binding.source) {
                values = _.map(binding.source, function (sourceId) {
                    if (_.isObject(sourceId)) {
                        return {
                            id: "MND",
                            type: "MND",
                            measureNames: measureIDs
                        };
                    } else {
                        return {
                            id: sourceId,
                            type: defn.type,
                            dataType: binding.feed === "timeAxis" ? "Date" : typeToDataTypeMap[defn.type]
                        };
                    }
                });
            }

            return {
                "id": defn.id,
                "values": values
            };
        });
    }

    function calculateBindingsToKeep(infoMetaData, currentBindings) {
        var allMetadataFieldIds = _.pluck(infoMetaData.fields, "id");

        return _.map(currentBindings, function (binding) {
            var filteredSource = _.filter(binding.source, function (bindingSource) {
                return _.isObject(bindingSource) || _.contains(allMetadataFieldIds, bindingSource);
            });

            return {
                feed: binding.feed,
                source: filteredSource
            };
        });
    }

    function calculateAnalysisObjectsToFeed(infoMetaData, bindingsToKeep) {

        var idsOfBindingsToKeep = _.reduce(bindingsToKeep, function (ids, binding) {
            return _.union(ids, binding.source);
        }, []);


        return _.reduce(infoMetaData.fields, function (objectsToFeed, field) {
            if (!_.contains(idsOfBindingsToKeep, field.id)) {
                objectsToFeed.push(_.pick(field, "id", "type", "dataType"));
            }

            return objectsToFeed;
        }, []);

    }

    function validateFeeds(chartType, feeds) {
        var oFeedService = sap.viz.moduleloader.require.config({context: 'lw-vizservices'})("sap/viz/vizservices/service/feed/FeedService");
        
    	var oValidationResult = oFeedService.validate(chartType, feeds);
        if (!oValidationResult.valid) {
        	var oErrorContext = {
                "chartType": chartType,
                "feeds": feeds,
                //{"valid":false,"results":{"bindings":{"categoryAxis":{"missing":1,"allowMND":false},"valueAxis2":{"missing":1}}}}
                "validationResult": oValidationResult
            };
            var measuresMissing = propertyFromPath(oValidationResult, "results.bindings.valueAxis.missing") ||
                propertyFromPath(oValidationResult, "results.bindings.valueAxis2.missing");
            var dimensionsMissing =  propertyFromPath(oValidationResult, "results.bindings.categoryAxis.missing");
            if (measuresMissing && dimensionsMissing) {
                throw new InfoChartException("bindings.missing.measuresAndDimensions", oErrorContext);
            } else if (measuresMissing) {
                throw new InfoChartException("bindings.missing.measures", oErrorContext);
            } else if (dimensionsMissing) {
                throw new InfoChartException("bindings.missing.dimensions", oErrorContext);
            } else {
                throw new InfoChartException("bindings.error", oErrorContext);
            }
        }
    }

    function propertyFromPath(obj, path) {
        return _.reduce(path.split("."), function(currentObject, pathItem) {
            return currentObject && currentObject[pathItem];
        }, obj);
    }

    function getBindingDefinition(chartType) {
        return sap.viz.api.metadata.Viz.get(chartType).bindings;
    }

    function getMeasureIds(bindingDefinition) {
        return _.pluck(_.where(bindingDefinition, {type: "Measure"}), "id");
    }

            function getMetadataForTimeSeriesCase(metadata, bindings) {

                var timeSeriesBinding = _.find(bindings, function (binding) {
                    return binding.feed === "timeAxis";
                });

                if (timeSeriesBinding && _.isArray(timeSeriesBinding.source) && timeSeriesBinding.source[0]) {
                    var timeSeriesDimensionId = timeSeriesBinding.source[0];
                    var timeSeriesField = _.find(metadata.fields, function (field) {
                        return field.id === timeSeriesDimensionId;
                    });
                    timeSeriesField.dataType = "Date";
                }
                return metadata;
            }

    return {
        suggestBindings: function (chartType, infoMetaData, oldBindings, oldChartType) {
            /*
             This suggest bindings service handles all of the logic for deciding
             what bindings should be sent to the chart.
             */

            var bindingDefinition;
            var measureIDs;
            var chartTypeHasChanged = Boolean(oldChartType && oldChartType !== chartType);
            var newFeedItems;

            bindingDefinition = getBindingDefinition(chartType);
            measureIDs = _.pluck(_.where(bindingDefinition, {type: "Measure"}), "id");

            var switchedChartBindings;

            if (chartTypeHasChanged) {
                var oldBindingDefinition = getBindingDefinition(oldChartType);
                var oldMeasureIDs = getMeasureIds(oldBindingDefinition);
                var oldFeedItems = generateFeedItems(oldBindings, oldBindingDefinition, oldMeasureIDs);
                var changedFeedItems = sap.viz.vizservices.BVRService
                    .switchFeeds(oldChartType, oldFeedItems, chartType)
                    .feedItems;
                switchedChartBindings = convertFeedItemsToBindings(changedFeedItems, measureIDs);
            }

            var bindingsToKeep = calculateBindingsToKeep(infoMetaData, switchedChartBindings || oldBindings);
            measureIDs = getMeasureIds(bindingDefinition);
            var feedItemsToKeep = generateFeedItems(bindingsToKeep, bindingDefinition, measureIDs);
            infoMetaData = getMetadataForTimeSeriesCase(infoMetaData, bindingsToKeep);
            var analysisObjectsToFeed = calculateAnalysisObjectsToFeed(infoMetaData, bindingsToKeep);

            newFeedItems = sap.viz.vizservices.BVRService
                .suggestFeeds(chartType, feedItemsToKeep, analysisObjectsToFeed)
                .feedItems;

            return convertFeedItemsToBindings(newFeedItems, measureIDs);
        },
        validateBindings: function(chartType, bindings) {
            var bindingDefinition = getBindingDefinition(chartType),
                measureIDs = getMeasureIds(bindingDefinition);

            validateFeeds(chartType, generateFeedItems(bindings, bindingDefinition, measureIDs));
        }
    };
});

