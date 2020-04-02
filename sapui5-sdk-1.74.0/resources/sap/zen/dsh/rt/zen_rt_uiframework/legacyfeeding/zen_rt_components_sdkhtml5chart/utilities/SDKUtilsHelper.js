define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/utilities/SDKUtilsHelper",
        [], function() {

    "use strict";

    var MAPPINGS = {
        "viz/column": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }]
        },
        "viz/line": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }]
        },
        "viz/horizontal_line": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }]
        },
        "trellis_pie": {
            "Dimension": [],
            "Measure": []
        },
        "viz/bar": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }]
        },
        "viz/horizontal_combination": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }]
        },
        "viz/combination": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }]
        },
        "viz/stacked_column": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }]
        },
        "viz/stacked_bar": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }]
        },
        "viz/100_stacked_column": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }]
        },
        "viz/100_stacked_bar": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }]
        },
        "viz/area": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }]
        },
        "viz/horizontal_area": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }]
        },
        "viz/radar": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 2,
                "name": "Region Color"
            }, {
                "id": "regionShape",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 3,
                "acceptMND": 0,
                "name": "Region Shape"
            }, {
                "id": "radarAxes",
                "type": "Dimension",
                "min": 1,
                "max": 1,
                "aaIndex": 1,
                "acceptMND": 1,
                "name": "Radar Axes"
            }],
            "Measure": [{
                "id": "radarAxesValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Radar Axes Values"
            }]
        },
        "trellis_radar": {
            "Dimension": [],
            "Measure": []
        },
        "viz/bubble": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 1,
                "aaIndex": 1,
                "acceptMND": -1,
                "name": "Region Color"
            }, {
                "id": "regionShape",
                "type": "Dimension",
                "min": 0,
                "max": 1,
                "aaIndex": 2,
                "acceptMND": -1,
                "name": "Region Shape"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": 1,
                "mgIndex": 1,
                "name": "Primary Values"
            }, {
                "id": "secondaryValues",
                "type": "Measure",
                "min": 1,
                "max": 1,
                "mgIndex": 2,
                "name": "Secondary Values"
            }, {
                "id": "bubbleWidth",
                "type": "Measure",
                "min": 1,
                "max": 1,
                "mgIndex": 3,
                "name": "Bubble Width"
            }, {
                "id": "bubbleHeight",
                "type": "Measure",
                "min": 0,
                "max": 1,
                "mgIndex": 4,
                "name": "Bubble Height"
            }]
        },
        "viz/scatter": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 1,
                "aaIndex": 1,
                "acceptMND": -1,
                "name": "Region Color"
            }, {
                "id": "regionShape",
                "type": "Dimension",
                "min": 0,
                "max": 1,
                "aaIndex": 2,
                "acceptMND": -1,
                "name": "Region Shape"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": 1,
                "mgIndex": 1,
                "name": "Primary Values"
            }, {
                "id": "secondaryValues",
                "type": "Measure",
                "min": 1,
                "max": 1,
                "mgIndex": 2,
                "name": "Secondary Values"
            }]
        },
        "viz/dual_line": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 0,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 1,
                "acceptMND": -1,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }, {
                "id": "secondaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 2,
                "name": "Secondary Values"
            }]
        },
        "viz/dual_bar": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }, {
                "id": "secondaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 2,
                "name": "Secondary Values"
            }]
        },
        "viz/dual_column": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }, {
                "id": "secondaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 2,
                "name": "Secondary Values"
            }]
        },
        "viz/dual_combination": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }, {
                "id": "secondaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 2,
                "name": "Secondary Values"
            }]
        },
        "viz/dual_horizontal_combination": {
            "Dimension": [{
                "id": "regionColor",
                "type": "Dimension",
                "min": 0,
                "max": 2,
                "aaIndex": 2,
                "acceptMND": 1,
                "name": "Region Color"
            }, {
                "id": "axisLabels",
                "type": "Dimension",
                "min": 1,
                "max": 2,
                "acceptMND": 0,
                "aaIndex": 1,
                "name": "Axis Labels"
            }],
            "Measure": [{
                "id": "primaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 1,
                "name": "Primary Values"
            }, {
                "id": "secondaryValues",
                "type": "Measure",
                "min": 1,
                "max": Infinity,
                "mgIndex": 2,
                "name": "Secondary Values"
            }]
        },
        "trellis_bar": {
            "Dimension": [],
            "Measure": []
        },
        "trellis_column": {
            "Dimension": [],
            "Measure": []
        },
        "trellis_line": {
            "Dimension": [],
            "Measure": []
        },
        "trellis_area": {
            "Dimension": [],
            "Measure": []
        },
        "trellis_horizontal_line": {
            "Dimension": [],
            "Measure": []
        },
        "trellis_horizontal_area": {
            "Dimension": [],
            "Measure": []
        },
        "heatmap": {
            "Dimension": [],
            "Measure": []
        },
        "treemap": {
            "Dimension": [],
            "Measure": []
        }
    };

    return function() {

        this.getMetadataFeedsArray = function(chartType, feedsType) {
            return MAPPINGS[chartType] && MAPPINGS[chartType][feedsType];
        }

        this.isChartFeedsEmpty = function (newChartOptionsProperties) {
            return !newChartOptionsProperties || !newChartOptionsProperties.feeds;
        };

        this.allChartOptionsMeasures = function (newChartOptionsProperties) {
            var allChartOptionsMeasures = [];
            if (!this.isChartFeedsEmpty(newChartOptionsProperties)) {
                for (var feed in newChartOptionsProperties.feeds) {
                    var feedArray = newChartOptionsProperties.feeds[feed];

                    if ((feedArray.indexOf("ROWS#") == 0) || (feedArray.indexOf("COLUMNS#") == 0))
                        continue;
                    if (feedArray === "ROWS" || feedArray === "COLUMNS")
                        continue;
                    if (feedArray === "BLANK") // blank feeding on axis
                        continue;

                    if (feedArray.length === 1  &&  feedArray[0] === "") // blank feeding on axis
                        continue;

                    for (var i = 0; i < feedArray.length; i++)
                        allChartOptionsMeasures.push(feedArray[i]);
                }
            }
            return allChartOptionsMeasures;
        };

        this.getMeasureKeyArr = function (data) {
            var ltMeasures = [];
            
            if (data != undefined && data.dimensions != undefined) {
                var ltDimensions = data.dimensions;
                for (var lDimensionIndex = 0; lDimensionIndex < ltDimensions.length; lDimensionIndex++) {
                    if (ltDimensions[lDimensionIndex].containsMeasures) {
                    	if (ltDimensions[lDimensionIndex].members != undefined) {
                            for (var lMemberIndex = 0; lMemberIndex < ltDimensions[lDimensionIndex].members.length; lMemberIndex++) {
                                var loMember = {};
                                loMember.key = ltDimensions[lDimensionIndex].members[lMemberIndex].key;
                                loMember.text = ltDimensions[lDimensionIndex].members[lMemberIndex].text;
                                ltMeasures.push(loMember);
                            }
                    	}
                    }
                }
            }
            
            return ltMeasures;
        };
        
        this.hasMeasures = function(data) {
            if (data != undefined && data.dimensions != undefined) {
                var ltDimensions = data.dimensions;
				for (var lDimensionIndex = 0; lDimensionIndex < ltDimensions.length; lDimensionIndex++) {
					if (ltDimensions[lDimensionIndex].containsMeasures) {
						return true;
					}
				}
             }

            return false;
        };
        
    }
});
