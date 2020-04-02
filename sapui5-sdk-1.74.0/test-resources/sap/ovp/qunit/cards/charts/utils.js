sap.ui.define([
    "sap/ui/thirdparty/jquery",
	"/sap/m/FlexBox",
	"sap/base/util/each"
], function (jQuery, FlexBox, each) {
	"use strict";

	//jQuery.sap.declare("sap.ovp.test.qunit.cards.charts.utils");
	//jQuery.sap.require("sap.ovp.test.qunit.cards.utils");
	var utils = {};
	utils.testBaseUrl = "test-resources/sap/ovp/";
	utils.odataBaseUrl = utils.testBaseUrl + "data/salesshare/";
	utils.odataRootUrl = "/sap/smartbusinessdemo/services/SalesShare.xsodata/";
	utils.odataBaseUrl2 = utils.testBaseUrl + "data/salesorder_parameters/";
	utils.odataRootUrl_InputParameters = "/sap/smartbusinessdemo/services/SalesOrderWithInputParam.xsodata/";

    utils.pathFormat = function (path) {
        return ('return ' + path);
    };

	utils.getElementsByTagName = function(xml,tagName) {
		return xml.getElementsByTagNameNS("*",tagName);
	};

	utils.vizNodeExists = function(xml,chartType) {
		var vizFrames = utils.getElementsByTagName(xml,'VizFrame');
		if ( !vizFrames || vizFrames.length == 0){
            return false;
        }
		return sap.ovp.test.qunit.cards.utils.validateXMLValue(vizFrames[0].getAttribute("vizType"),chartType);
	};

	utils.vizNodeNotExists = function(xml, chartType) {
		return !utils.vizNodeExists(xml, chartType);
	};

	utils.vizSkeletonExists = function(xml) {
		var vizFrames = utils.getElementsByTagName(xml,'VizFrame');
        if (!vizFrames || vizFrames.length > 1) {
            return false;
		}
        if (vizFrames[0].getAttribute("vizType") == undefined) {
            return false;
        }
		var dataSet = utils.getElementsByTagName(vizFrames[0],'dataset');
        if (!dataSet || dataSet.length > 1) {
            return false;
        }
		var flattenedDataSet = utils.getElementsByTagName(dataSet[0],'FlattenedDataset');
        if (!flattenedDataSet || flattenedDataSet.length > 1) {
            return false;
        }
		var data = flattenedDataSet[0].getAttribute("data");
        if (!data) {
            return false;
        }
		try {
			//data = eval("(" + data + ")");
            //data = (new Function('return '+data))();
            data = utils.pathFormat(data);
		} catch(ex) {
			return false;
		}
		var dimensions = utils.getElementsByTagName(flattenedDataSet[0],'dimensions');
        if (!dimensions || dimensions.length > 1) {
            return false;
		}

		var dimensionDefinitions = utils.getElementsByTagName(dimensions[0],'DimensionDefinition');
        if (!dimensionDefinitions || dimensionDefinitions.length == 0) {
            return false;
        }
		for ( var i = 0; i < dimensionDefinitions.length; i++ ) {
            if (dimensionDefinitions[i].getAttribute("name") == undefined || dimensionDefinitions[i].getAttribute("name") == "") {
                return false;
            }
            if (dimensionDefinitions[i].getAttribute("value") == undefined || dimensionDefinitions[i].getAttribute("value") == "") {
                return false;
            }
		}

		var measures = utils.getElementsByTagName(flattenedDataSet[0],'measures');
        if (!measures || measures.length > 1) {
            return false;
        }

		var measureDefinitions = utils.getElementsByTagName(measures[0],'MeasureDefinition');
        if (!measureDefinitions || measureDefinitions.length == 0) {
            return false;
        }

		for ( var i = 0; i < measureDefinitions.length; i++ ) {
            if (measureDefinitions[i].getAttribute("name") == undefined || measureDefinitions[i].getAttribute("name") == "") {
                return false;
            }
            if (measureDefinitions[i].getAttribute("value") == undefined || measureDefinitions[i].getAttribute("value") == "") {
                return false;
			}
		}

		if ( vizFrames[0].getAttribute("vizType") == "line" ) {
			var feeds = utils.getElementsByTagName(vizFrames[0],'feeds');
            if (!feeds || feeds.length > 1) {
                return false;
            }

			var feedItems = utils.getElementsByTagName(feeds[0],'FeedItem');
            if (!feedItems || feedItems.length < 2) {
                return false;
            }

			var collection = ['Dimension','Measure'];
			var type = feedItems[0].getAttribute("type");
			if ( collection.indexOf(type) == -1 ){
                return false;
            } else {
				collection.splice(collection.indexOf(type),1);
			}
			var type = feedItems[1].getAttribute("type");
            if (collection.indexOf(type) == -1) {
                return false;
            }
		}
		return true;
	};

	utils.dataBinding = function(xml,expected) {
		var vizFrame = utils.getElementsByTagName(xml,'OVPVizDataHandler')[0];
		//var flattenedDataSet = utils.getElementsByTagName(vizFrame,'FlattenedDataset')[0];

		var data = vizFrame.getAttribute("data");
		try {
			//data = eval("(" + data + ")");
            //data = (new Function('return '+data))();
            data = utils.pathFormat(data);
		} catch(ex) {
			return false;
		}
        if (data.path != expected.path) {
            return false;
		}
        if ((!data.filters || data.filters.length == 0) && ( expected.filters && expected.filters.length > 0)) {
            return false;
        }
        if ((!expected.filters || expected.filters.length == 0) && ( data.filters && data.filters.length > 0)) {
            return false;
        }
		if ( data.filters && expected.filters ) {
            if (data.filters.length != expected.filters.length) {
                return false;
            }
			for ( var i = 0; i < expected.filters.length; i++ ) {
				var flag = false;
				for ( var j = 0; j < data.filters.length; j++ ) {
					if ( expected.filters[i].path == data.filters[j].path && expected.filters[i].operator == data.filters[j].operator && expected.filters[i].value1 == data.filters[j].value1 ) {
						flag = true;
						break;
					}
				}
                if (!flag) {
                    return false;
                }
			}
		}
        if ((!data.sorter || data.sorter.length == 0) && ( expected.sorter && expected.sorter.length > 0)) {
            return false;
        }
        if ((!expected.sorter || expected.sorter.length == 0) && ( data.sorter && data.sorter.length > 0)) {
            return false;
        }
		if ( data.sorter && expected.sorter ) {
            if (data.sorter.length != expected.sorter.length) {
                return false;
            }
			for ( i = 0; i < expected.sorter.length; i++ ) {
				var flag = false;
				for ( var j = 0; j < data.sorter.length; j++ ) {
					if ( expected.sorter[i].path == data.sorter[j].path && expected.sorter[i].descending == data.sorter[j].descending ) {
						flag = true;
						break;
					}
				}
                if (!flag) {
                    return false;
                }
			}
		}
		/*
		 * check for MaxItems annotation.
		 * The length property used here is the `length` attribute of the binding
		 * which later becomes $top, not the length of the data type.
		 */
		if (expected.length) {
			if (!data.length) {
				return false;
			}
			return expected.length == data.length;
		}
		/* when no/zero MaxItems are given, check no/zero length is given in binding */
		return !data.length;
	};


	utils.feedBinding = function(xml,expected) {
		var vizFrame = utils.getElementsByTagName(xml,'VizFrame')[0];
		var feedItems = utils.getElementsByTagName(vizFrame,'FeedItem');
        if ((!feedItems || feedItems.length == 0) && (expected && expected.length > 0 )) {
            return false;
        }
        if ((!expected || expected.length == 0) && (feedItems && feedItems.length > 0 )) {
            return false;
        }
		if ( feedItems && expected ) {
            if (feedItems.length != expected.length) {
                return false;
            }
			for ( var i = 0; i < expected.length; i++ ) {
				var flag = false;
				for ( var j = 0; j < feedItems.length; j++ ) {
					if ( expected[i].uid == feedItems[j].getAttribute("uid") && expected[i].type == feedItems[j].getAttribute("type") ) {
						var expectedItems = expected[i].values.split(",");
						var feedItemValues = feedItems[j].getAttribute("values").split(",");
                        if (expectedItems.length != feedItemValues.length) {
                            return false;
                        }
						for ( var k = 0; k < expectedItems.length; k++ ) {
                            if (feedItemValues.indexOf(expectedItems[k]) == -1) {
                                return false;
                            }
						}
						flag = true;
						break;
					}
				}
                if (!flag) {
                    return false;
                }
			}
		}
		return true;
	};

	utils.ovpNodeExists = function(xml, bFiltersExist, bDataPointExist) {
		if (typeof bFiltersExist == "undefined") {
			bFiltersExist = true;
		}
		if (typeof bDataPointExist == "undefined") {
			bDataPointExist = true;
		}
		var headers = xml.getElementsByClassName("sapOvpCardHeader");
        if (!headers || headers.length == 0) {
            return false;
        }

		var ovp = headers[0];
		var sapOvpKPIHeaderNumberValueStyle = ovp.getElementsByClassName("sapOvpKPIHeaderNumberValueStyle");

		if (bDataPointExist) {
            if (!sapOvpKPIHeaderNumberValueStyle || sapOvpKPIHeaderNumberValueStyle.length == 0) {
                return false;
            }
            /* as per incident 1670363258 we are showing this class if there is content inside UOM. if we show
             this class by default in every case then it will add blank space.
             */

			/*var sapOvpKPIHeaderUnitOfMeasureStyle = ovp.getElementsByClassName("sapOvpKPIHeaderUnitOfMeasureStyle");

			if ( !sapOvpKPIHeaderUnitOfMeasureStyle || sapOvpKPIHeaderUnitOfMeasureStyle.length == 0 )
				return false;
*/
			var sapOvpKPIHeaderTrendPercentStyle = ovp.getElementsByClassName("sapOvpKPIHeaderTrendPercentStyle");
            //as per jira item 3323 we are showing this class content if TrendCalculation is present in annotations.xml
            if (!sapOvpKPIHeaderTrendPercentStyle) {
                return false;
            }
		}

        /* as per incident 1670363258 we are showing this class if there is content inside selection varient. if we show
           this class by default in every case then it will add blank space
        */

		/*var sapOvpKPIHeaderFilterStyle = ovp.getElementsByClassName("sapOvpKPIHeaderFilterStyle");

		if (bDataPointExist && bFiltersExist && (!sapOvpKPIHeaderFilterStyle || sapOvpKPIHeaderFilterStyle.length == 0))
			return false;*/

		var content = utils.getElementsByTagName(xml,"CardContentContainer");
        if (!content || content.length == 0) {
            return false;
        }
		return true;
	};

	utils.referenceValuePathExists = function(xml, referenceValue) {
		var list = utils.getElementsByTagName(xml, "NumericContent")[0];
		var indicator = list.getAttribute("indicator");
		//indicator = eval("(" + indicator + ")");
        //indicator = (new Function('return '+indicator))();
        indicator = new Function(utils.pathFormat(indicator))();

		if (!indicator.parts) {
			return false;
		}

		if (indicator.parts){
			var array = indicator.parts;
			for (var i = 0; i < array.length; i++) {
				if (array[i].path == referenceValue) {
					return true;
				}
			}
		}
	};


	utils.dimensionItemsNodeExists = function(xml,expected) {
		return utils.itemsNodeExists(xml,expected,"dimensions","DimensionDefinition");
	};

	utils.measureItemsNodeExists = function(xml,expected) {
		return utils.itemsNodeExists(xml,expected,"measures","MeasureDefinition");
	};

	utils.itemsNodeExists = function(xml,expected,category,categoryDefinition) {
		var dimensions = utils.getElementsByTagName(xml,category)[0];
        if (!dimensions) {
            return false;
        }
		var dimensionDefinitions = utils.getElementsByTagName(xml,categoryDefinition);
        if (!dimensionDefinitions) {
            return false;
        }
        if (dimensionDefinitions.length != expected.length) {
            return false;
        }
		for ( var i = 0; i < expected.length; i++ ) {
			var flag = false;
			for ( var j = 0; j < dimensionDefinitions.length; j++ ) {
				if ( expected[i].name == dimensionDefinitions[j].getAttribute("name") && expected[i].value == dimensionDefinitions[j].getAttribute("value") ) {
					flag = true;
					break;
				}
			}
            if (!flag) {
                return false;
            }

		}
		return true;
	};

	utils.getSimulatedIContext = function(oView) {
		return {
			getSetting : function(modelName) {
				var ret = null;
				if (oView.hasModel(modelName)) {
					ret = oView.getModel(modelName);
				}
				return ret;
			}
		};
	};

	utils.getDimensionsArgument = function(dimensionArray) {
		var ret = [];
		each(dimensionArray, function(i, d) {
			ret.push({"Dimension": {
				"PropertyPath": d.name
			},
			"Role":{"EnumMember":"com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"},
			"RecordType":"com.sap.vocabularies.UI.v1.ChartDimensionAttributeType"
			});
		});
		return ret;
	};

	utils.isValidString = function(testee) {
		return typeof testee === "string";
	};

	utils.isValidBoolean = function(testee) {
		return typeof testee === "boolean";
	};

	utils.isValidDate = function(testee) {
		return testee.constructor === Date;
	};

	utils.testNoDataSection = function() {
		var event = {getParameter: function() {return null;}};
		//jQuery.sap.require("FlexBox");
		var container = new FlexBox({
			items: [new FlexBox()]
		});
		var el = container.getItems()[0];
		sap.ovp.cards.charts.VizAnnotationManager.checkNoData(event, container, el);
		var resultantItem = container.getItems()[0];
		if (!resultantItem || !resultantItem.hasStyleClass("noDataSection")) {
			return false;
		}
		return true;
	};

	utils.genericFeedBinding = function(xml, vizComp, expected) {
		var feedItems = vizComp.getFeeds();
        if (!feedItems || feedItems.length == 0) {
            return false;
        }
        if (!expected || expected.length == 0) {
            return false;
        }
		if ( feedItems && expected ) {
            if (feedItems.length != expected.length) {
                return false;
            }
			for ( var i = 0; i < expected.length; i++ ) {
				var flag = false;
				for ( var j = 0; j < feedItems.length; j++ ) {
					if ( expected[i].uid == feedItems[j].getUid() && expected[i].type == feedItems[j].getType() ) {
						var expectedItems = expected[i].values.split(",");
						var feedItemValues = feedItems[j].getValues();
                        if (expectedItems.length != feedItemValues.length) {
                            return false;
                        }
						for ( var k = 0; k < expectedItems.length; k++ ) {
                            if (feedItemValues.indexOf(expectedItems[k]) == -1) {
                                return false;
                            }
						}
						flag = true;
						break;
					}
				}
                if (!flag) {
                    return false;
                }
			}
		}
		return true;
	};

	utils.checkVizProperties = function(actual, expected) {
        if (actual == undefined) {
            return false;
        }
		if (typeof expected == 'object') {
			for (var property in expected ) {
				var flag = utils.checkVizProperties(actual[property],expected[property]);
                if (flag == false) {
                    return false;
                }
			}
		}
		if (typeof expected == 'number') {
            if (actual === expected) {
                return true;
            } else {
                return false;
            }
		}
		return true;
	};

	utils.genericDimensionItemsNodeExists = function(vizComp,expected, bDisplayVal) {
		if (typeof bDisplayVal == undefined) {
			bDisplayVal = true;
		}
		var dimensions = vizComp.getDataset().getDimensions();
        if (!dimensions) {
            return false;
        }
		for ( var i = 0; i < expected.length; i++ ) {
			var flag = false;
			for ( var j = 0; j < dimensions.length; j++ ) {
				var displayValueTest;
                var dimensionVal = "{" + dimensions[j].getBinding("value").getPath() + "}";
                var dimensionDisplayVal = "{" + dimensions[j].getBinding("displayValue").getPath() + "}";
				if (bDisplayVal) {
					displayValueTest = expected[i].displayValue == dimensionDisplayVal;
				} else {
					displayValueTest = true;
				}
				if ( expected[i].name == dimensions[j].getName() &&
						expected[i].value == dimensionVal &&
						displayValueTest) {
					flag = true;
					break;
				}
			}
            if (!flag) {
                return false;
            }

		}
		return true;
	};

	utils.genericMeasureItemsNodeExists = function(vizComp,expected) {
		var measures = vizComp.getDataset().getMeasures();
        if (!measures) {
            return false;
        }
		for ( var i = 0; i < expected.length; i++ ) {
			var flag = false;
			for ( var j = 0; j < measures.length; j++ ) {
                var measureVal = "{" + measures[j].getBinding("value").getPath() + "}";
                if (expected[i].name == measures[j].getName() && expected[i].value == measureVal) {
                    flag = true;
                    break;
                }
			}
            if (!flag) {
                return false;
            }
		}
		return true;
	};

	utils.checkAxisTitleVisibility = function(cardViz, value) {
		var oVizProperties = cardViz.getVizProperties();
		var aUids = jQuery.map(cardViz.getFeeds(), function(f, i) { return f.getUid();});
		var flag = true;
		aUids.forEach(function(uid, i) {
			var current = oVizProperties[uid];
			if (!current || !current.title ||
					current.title.visible !== value) {
				flag = false;
				i = uid.length;
			}
		});
		return flag;
	};
	return utils;
});
