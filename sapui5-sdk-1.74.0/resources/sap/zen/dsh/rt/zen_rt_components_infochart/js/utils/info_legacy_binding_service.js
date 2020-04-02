/*global define */
define("zen.rt.components.infochart/js/utils/info_legacy_binding_service",[
        "zen.rt.uiframework/legacyfeeding/LegacyInitialViewFeeding",
        "underscore"], function(LegacyInitialViewFeeding, _) {

    "use strict";

    var FEED_ID_MAP = {
        "primaryValues": "valueAxis",
        "regionColor": "color",
        "pieSectorColor": "color",
        "pieSectorSize": "size",
        "axisLabels": "categoryAxis"
    };

    function LegacyBindingService(cvomDataGetter) {
        this._cvomDataGetter = cvomDataGetter || new LegacyInitialViewFeeding();
    }

    LegacyBindingService.prototype.createBindings = function(chartType, rawSdkData) {
        var cvomData = this._cvomDataGetter.getFeedingData(chartType, rawSdkData),
            oFeeds = _.chain(cvomData.feeding)
                .map(_.partial(vizFeedToInfoChartFeed, cvomData.data, rawSdkData))
                .filter(_.isObject)
                .value();

        if (isCategoryFeedEmpty(oFeeds, true)) {
            moveMeasureNamesBindingToCategoryAxisFeed(oFeeds);
        }
        return oFeeds;
    };

    /*
        Sample outputs:
            1. {"source":[],"feed":"dataFrame"}
            2. {"source":["education",{"measureNames":["valueAxis"]}],"feed":"categoryAxis"}
            3. {"source":["gender"],"feed":"color"}
            4. {"source":["store_sales","unit_sales","store_cost"],"feed":"valueAxis"}
    */
    function vizFeedToInfoChartFeed(feedData, rawSdkData, feed) {
        var id = FEED_ID_MAP[feed.feedId];

        return id && {
            "feed": id,
            "source": flatMap(feed.binding, _.partial(mapBinding, feedData, rawSdkData))
        };
    }

    function mapBinding(feedData, rawSdkData, binding) {
        var bindingMappingFunctions = {
                "measureValuesGroup": mapMeasureValuesGroupBinding,
                "analysisAxis": mapAnalysisAxisBinding,
                "measureNamesDimension": _.constant({ "measureNames": ["valueAxis"] })
            };

        return bindingMappingFunctions[binding.type] &&
                bindingMappingFunctions[binding.type](feedData, rawSdkData, binding);
    }

    function mapMeasureValuesGroupBinding(feedData, rawSdkData, binding) {
        var measureValuesGroup = _.findWhere(feedData.measureValuesGroup, { "index": binding.index }).data;
        return _.map(measureValuesGroup, function(measure) {
            return measure.key;
        });
    }

    function mapAnalysisAxisBinding(feedData, rawSdkData, binding) {
        var analysisAxis = _.findWhere(feedData.analysisAxis, { "index": binding.index }).data;
        return _.chain(analysisAxis)
            .map(function(aa) {
                return _.findWhere(rawSdkData.dimensions, { "text": aa.name});
            })
            .reject(_.isUndefined)
            .pluck("key")
            .value();
    }

    function flatMap(arr, mapFn) {
        return _.chain(arr)
            .map(mapFn)
            .filter(_.isObject)
            .flatten(true)
            .value();
    }

    function getCategoryFeed(oFeeds) {
        var oCategoryFeed = _.findWhere(oFeeds, { "feed": "categoryAxis"});
        return oCategoryFeed;
    }
    
    function isCategoryFeedEmpty(oFeeds, bCheckExistance) {
        var oCategoryFeed = getCategoryFeed(oFeeds);
        if (bCheckExistance && !oCategoryFeed) {
        	return false;
        }
        return !oCategoryFeed || !oCategoryFeed.source || !oCategoryFeed.source.length;
    }

    function moveMeasureNamesBindingToCategoryAxisFeed(oFeeds) {
        var oCategoryFeed = getCategoryFeed(oFeeds),
            isMeasureNamesSource = _.partial(_.has, _, "measureNames");
        
        if (!oCategoryFeed) {
        	oCategoryFeed = { "feed": "categoryAxis" };
        	oFeeds.push(oCategoryFeed);
        }
        
        _.forEach(oFeeds, function(oFeed) {
        	oFeed.source = _.reject(oFeed.source, isMeasureNamesSource);
        });
        
        oCategoryFeed.source = [{ "measureNames": ["valueAxis"] }];
    }

    return LegacyBindingService;
});