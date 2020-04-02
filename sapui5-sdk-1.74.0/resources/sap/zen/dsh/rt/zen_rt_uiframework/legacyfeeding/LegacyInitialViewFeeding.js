/*global define*/
define("zen.rt.uiframework/legacyfeeding/LegacyInitialViewFeeding", [
	"zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/SDKhtml5chart_util",
	"underscore"], function(SdkHtml5ChartUtil, _) {

	"use strict";

	function LegacyInitialViewFeeding(TestSdkHtml5ChartUtil) {
		this._SdkHtml5ChartUtil = TestSdkHtml5ChartUtil || SdkHtml5ChartUtil;
	}

	LegacyInitialViewFeeding.prototype.getFeedingData = function(chartType, rawSdkData, dFeedItems) {
		var oldVizType = getOldVizType(chartType),
            chart = new this._SdkHtml5ChartUtil().createCvomChart("NotUsedId", oldVizType),
            dataMapper = createDataMapper(chart),
            cvomData = dataMapper.mapData(chart, rawSdkData),
            flatTableDs = cvomData.ds,
            feeding = cvomData.dataFeeding || autoGenerateVizFeeding(oldVizType);


        if(!dFeedItems && isDualAxisChart(chartType)) {
            chart.setData(rawSdkData); // XXX: Is this needed?
            dFeedItems = getDAxisDefaultFeedItem (chart);
        }

        return {
            "data": flatTableDs.data(),
            "feeding": feeding,
            "dFeedItems": dFeedItems
        };
	};

    function createDataMapper(chart) {
        var dataMapper = chart.createDataMapper();
        dataMapper.getMessages = _.constant({
            "chart_mapping_error": "why is this needed?"
        });
        return dataMapper;
    }

    function autoGenerateVizFeeding(chartType) {
        // This should only happen for pie charts
        if (chartType !== "pie") {
            return [];
        }
        // XXX: Is this always the same for a pie chart?
        return [{
            "feedId": "pieSectorColor",
            "binding": [{
                "type": "analysisAxis",
                "index": 1
            }]
        }, {
            "feedId": "pieSectorSize",
            "binding": [{
                "type": "measureValuesGroup",
                "index": 1
            }]
        }];
    }

    function getOldVizType(chartType) {
        return chartType.replace(/((viz)|(info))\//, "");
    }


    function isDualAxisChart(chartType) {
        return chartType && chartType.indexOf("dual") !== -1;
    }
    
    function getDAxisDefaultFeedItem (chart) {
        var dFeedItems;
        try {
            dFeedItems = chart.getPropertyValues().plotObjectType.dataByInitialView;
        } catch(e) {
            dFeedItems = null;
        }
        return dFeedItems;
    }

    return LegacyInitialViewFeeding;
});