jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.require('sap.apf.testhelper.config.representationHelper');

sap.ui.define([
	'sap/apf/ui/representations/utils/vizFrameSelectionHandler',
	'sap/apf/testhelper/doubles/createUiApiAsPromise'
	], function(VizFrameSelectionHandler, createUiApiAsPromise) {
	"use strict";

	var oVizFrameSelectionHandler,
		oParameter,
		oRepresentationHelper,
		aDataResponse;
	function _getFieldDesc() {
		return {
			"type" : "label",
			"kind" : "text",
			"key" : "CompanyCodeCountryName"
		};
	}
	/**
	 * @description pushes a data object with the given content to the given selection
	 * @param {array} aParameter the selection array to push the content to
	 * @param {*} content the content to use
	 * @param {boolean} bFull if the data object should have all properties instead of just 'property1'
	 */
	function pushToSelection(aParameter, content, bFull) {
		var data = {
			property1 : content
		};
		if (bFull) {
			data.property2 = content;
		}

		aParameter.push({
			data : data
		});
	}
	/**
	 * @description returns if the two sets are equal, item equality is tested with the optional 'fnEqual' method
	 * @param {array} aSetA first set
	 * @param {array} aSetB second set
	 * @param {function} [fnEqual = ==] item equality function (optional)
	 */
	function areSetsEqual(aSetA, aSetB, fnEqual) {
		//if the sets doesn't have the same 'length' => they cannot be equal
		if (aSetA.length !== aSetB.length) {
			return false;
		}

		fnEqual = fnEqual || function(a, b) { return a === b; };

		//if not for every value a in A there is some value b in B with a equal to b => sets not equal
		if (!aSetA.every(function(valueO) {
			return aSetB.some(function(valueI) {
				return fnEqual(valueO, valueI);
			});
		})) {
			return false;
		}
		//if not for every value b in B there is some value a in A with b equal to a => sets not equal
		if (!aSetB.every(function(valueO) {
			return aSetA.some(function(valueI) {
				return fnEqual(valueO, valueI);
			});
		})) {
			return false;
		}
		return true;
	}
	/**
	 * @description returns if the two data points are equal regarding 'property1', which has to be present, and 'property2', if present
	 * @param {*} data0 first data point
	 * @param {*} data1 second data point
	 */
	function areDataPointsEqual(data0, data1) {
		//check if property1 is present in both data points and equal
		if (data0.data.property1 === undefined || data1.data.property1 === undefined) {
			return undefined;
		}
		if (data0.data.property1 !== data1.data.property1) {
			return false;
		}
		//check if property2 is equal (or not present in both data points)
		if (data0.data.property2 !== data1.data.property2) {
			return false;
		}
		return true;
	}

	QUnit.module("VizFrame Selection Handler with default label of property", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			createUiApiAsPromise().done(function(oApi) {
				that.oGlobalApi = oApi;
				oRepresentationHelper = sap.apf.testhelper.config.representationHelper.prototype;
				oParameter = oRepresentationHelper.representationDataDimensionContainsFilterProperty();
				aDataResponse = sap.apf.testhelper.odata.getSampleService(that.oGlobalApi.oApi, 'sampleData');
				oVizFrameSelectionHandler = new VizFrameSelectionHandler.constructor(oParameter, that.oGlobalApi.oApi);
				done();
			});
		},
		afterEach: function(){
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When viz frame selection handler object is set", function(assert) {
		assert.ok(oVizFrameSelectionHandler, "then correct column name is generated for display option key");
	});
	QUnit.test("When getSelectionInfoFromFilter is called ", function(assert) {
		var aDataPoint = oVizFrameSelectionHandler.getSelectionInfoFromFilter([ "AR" ], aDataResponse);
		assert.strictEqual(aDataPoint.length, 8, "then selection points are filtered from data response by given filter");
		aDataPoint.forEach(function(dataPoint) {
			assert.strictEqual(dataPoint.data.CompanyCodeCountry, "AR", "then selection points are filtered by given filter 'AR'");
		});
	});
	QUnit.test("When getSelectionInfoFromFilter is called ", function(assert) {
		var originalField = "original_CompanyCodeCountry";
		aDataResponse.forEach(function(row){
			row[originalField] = row["CompanyCodeCountry"] + "originalValue";
		});
		var aDataPoint = oVizFrameSelectionHandler.getSelectionInfoFromFilter([ "ARoriginalValue" ], aDataResponse);
		assert.strictEqual(aDataPoint.length, 8, "then selection points are filtered from data response by given filter");
		aDataPoint.forEach(function(dataPoint) {
			assert.strictEqual(dataPoint.data.CompanyCodeCountry, "AR", "then selection points are filtered by filter 'AR'");
		});
	});
	QUnit.test("When getSelectionInfoFromFilter is called in case no data response", function(assert) {
		var aDataPoint = oVizFrameSelectionHandler.getSelectionInfoFromFilter([ "AR" ], []);
		assert.strictEqual(aDataPoint.length, 0, "then selection points are empty");
	});

	QUnit.module("VizFrame Selection Handler with manually entered label for required property", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			createUiApiAsPromise().done(function(oApi) {
				that.oGlobalApi = oApi;
				oRepresentationHelper = sap.apf.testhelper.config.representationHelper.prototype;
				oParameter = oRepresentationHelper.representationDataDimensionContainsFilterProperty();
				oParameter.dimensions[0].fieldDesc = _getFieldDesc();
				oParameter.requiredFilterOptions = {
					"labelDiplsayOption" : "Text",
					"fieldDesc" : {
						"type" : "label",
						"kind" : "text",
						"key" : "Company Code Country Name Custom Text"
					}
				};
				aDataResponse = sap.apf.testhelper.odata.getSampleService(that.oGlobalApi.oApi, 'sampleData');
				oVizFrameSelectionHandler = new VizFrameSelectionHandler.constructor(oParameter, that.oGlobalApi.oApi);
				done();
			});
		},
		afterEach: function(){
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When viz frame selection handler object is set", function(assert) {
		assert.ok(oVizFrameSelectionHandler, "then correct column name is generated for display option key");
	});
	QUnit.test("When getSelectionInfoFromFilter is called to draw the filters on the charts - filter value will remain same even though label for filter manually given", function(assert) {
		var aDataPoint = oVizFrameSelectionHandler.getSelectionInfoFromFilter([ "AR" ], aDataResponse);
		assert.strictEqual(aDataPoint.length, 8, "then selection points are filtered from data response by given filter");
		aDataPoint.forEach(function(dataPoint) {
			assert.strictEqual(dataPoint.data.CompanyCodeCountry, "AR", "then selection points are filtered by given filter 'AR'");
			assert.strictEqual(dataPoint.data.hasOwnProperty(oParameter.requiredFilters[0]), true, "Then data point has the required property");
		});
	});

	QUnit.module("VizFrame Selection Handler getSelectionInfoFromEvent without initial selection", {
		beforeEach : function(assert) {
			var done = assert.async();
			var testEnv = this;

			createUiApiAsPromise().done(function(oApi) {
				testEnv.oApi = oApi;
				var parameter = {
					requiredFilters : ["property1", "property2"] //only the first filter will be used
				};
				testEnv.aChartSelection = [];
				testEnv.oSelectionHandler = new VizFrameSelectionHandler.constructor(parameter, oApi);
				done();
			})
		},
		afterEach: function(){
			this.oApi.oCompContainer.destroy();
		}
	});
	//the selection handler should be able to handle an empty selection
	QUnit.test("select none", function(assert) {
		//arrange
		var inputEvent = {
			mParameters : {
				data : []
			}
		};
		var expectedSelectionInfo = {
			dataPointsFromSelection : [],
			aUniqueFilterValueFromChart : []
		};
		//act
		var actualSelectionInfo = this.oSelectionHandler.getSelectionInfoFromEvent(inputEvent, false, this.aChartSelection);
		//assert
		assert.ok(areSetsEqual(actualSelectionInfo.dataPointsFromSelection, expectedSelectionInfo.dataPointsFromSelection, areDataPointsEqual), "selection info has no data points");
		assert.ok(areSetsEqual(actualSelectionInfo.aUniqueFilterValueFromChart, expectedSelectionInfo.aUniqueFilterValueFromChart), "selection info has no filter values");
	});
	//the selection handler has to look at each data point
	QUnit.test("select multiple", function(assert) {
		//arrange
		var inputEvent = {
			mParameters : {
				data : []
			}
		};
		pushToSelection(inputEvent.mParameters.data, 0, true);
		pushToSelection(inputEvent.mParameters.data, 1, true);

		var expectedSelectionInfo = {
			dataPointsFromSelection : [],
			aUniqueFilterValueFromChart : [0, 1]
		};
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 0, false);
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 1, false);
		//act
		var actualSelectionInfo = this.oSelectionHandler.getSelectionInfoFromEvent(inputEvent, false, this.aChartSelection);
		//assert
		assert.ok(areSetsEqual(actualSelectionInfo.dataPointsFromSelection, expectedSelectionInfo.dataPointsFromSelection, areDataPointsEqual), "selection info has all data points");
		assert.ok(areSetsEqual(actualSelectionInfo.aUniqueFilterValueFromChart, expectedSelectionInfo.aUniqueFilterValueFromChart), "selection info has all filter values");
	});
	//the selection handler should return each data point only once
	QUnit.test("select multiple with duplicates", function(assert) {
		//arrange
		var inputEvent = {
			mParameters : {
				data : []
			}
		};
		pushToSelection(inputEvent.mParameters.data, 0, true);
		pushToSelection(inputEvent.mParameters.data, 1, true);
		pushToSelection(inputEvent.mParameters.data, 1, true);

		var expectedSelectionInfo = {
			dataPointsFromSelection : [],
			aUniqueFilterValueFromChart : [0, 1]
		};
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 0, false);
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 1, false);
		//act
		var actualSelectionInfo = this.oSelectionHandler.getSelectionInfoFromEvent(inputEvent, false, this.aChartSelection);
		//assert
		assert.ok(areSetsEqual(actualSelectionInfo.dataPointsFromSelection, expectedSelectionInfo.dataPointsFromSelection, areDataPointsEqual), "selection info has all unique data points");
		assert.ok(areSetsEqual(actualSelectionInfo.aUniqueFilterValueFromChart, expectedSelectionInfo.aUniqueFilterValueFromChart), "selection info has all unique filter values");
	});
	//the selection handler should be handle to handle an empty deselection
	QUnit.test("deselect none", function(assert) {
		//arrange
		var inputEvent = {
			mParameters : {
				data : []
			}
		};
		var expectedSelectionInfo = {
			dataPointsFromSelection : [],
			aUniqueFilterValueFromChart : []
		};
		//act
		var actualSelectionInfo = this.oSelectionHandler.getSelectionInfoFromEvent(inputEvent, true, this.aChartSelection);
		//assert
		assert.ok(areSetsEqual(actualSelectionInfo.dataPointsFromSelection, expectedSelectionInfo.dataPointsFromSelection, areDataPointsEqual), "selection info has no data points");
		assert.ok(areSetsEqual(actualSelectionInfo.aUniqueFilterValueFromChart, expectedSelectionInfo.aUniqueFilterValueFromChart), "selection info has no filter values");
	});
	//the selection handler should be able to handle a deselection on an empty chart selection
	QUnit.test("deselect multiple", function(assert) {
		var inputEvent = {
			mParameters : {
				data : []
			}
		};
		pushToSelection(inputEvent.mParameters.data, 0, true);
		pushToSelection(inputEvent.mParameters.data, 1, true);

		var expectedSelectionInfo = {
			dataPointsFromSelection : [],
			aUniqueFilterValueFromChart : []
		};
		//act
		var actualSelectionInfo = this.oSelectionHandler.getSelectionInfoFromEvent(inputEvent, true, this.aChartSelection);
		//assert
		assert.ok(areSetsEqual(actualSelectionInfo.dataPointsFromSelection, expectedSelectionInfo.dataPointsFromSelection, areDataPointsEqual), "selection info has no data points");
		assert.ok(areSetsEqual(actualSelectionInfo.aUniqueFilterValueFromChart, expectedSelectionInfo.aUniqueFilterValueFromChart), "selection info has no filter values");
	});

	QUnit.module("VizFrame Selection Handler getSelectionInfoFromEvent with initial selection (with duplicates)", {
		beforeEach : function(assert) {
			var done = assert.async();
			var testEnv = this;

			createUiApiAsPromise().done(function(oApi) {
				testEnv.oApi = oApi;
				var parameter = {
					requiredFilters : ["property1", "property2"] //only the first filter will be used
				};

				testEnv.aChartSelection = [];
				pushToSelection(testEnv.aChartSelection, 0, true);
				pushToSelection(testEnv.aChartSelection, 1, true);
				pushToSelection(testEnv.aChartSelection, 1, true);
				pushToSelection(testEnv.aChartSelection, 2, true);
				pushToSelection(testEnv.aChartSelection, 2, true);
				pushToSelection(testEnv.aChartSelection, 3, true);

				testEnv.oSelectionHandler = new VizFrameSelectionHandler.constructor(parameter, oApi);
				done();
			})
		},
		afterEach: function(){
			this.oApi.oCompContainer.destroy();
		}
	});
	//the selection handler should return each data point in the previous selection only once
	QUnit.test("select none", function(assert) {
		//arrange
		var inputEvent = {
			mParameters : {
				data : []
			}
		};

		var expectedSelectionInfo = {
			dataPointsFromSelection : [],
			aUniqueFilterValueFromChart : [0, 1, 2, 3]
		};
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 0, false);
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 1, false);
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 2, false);
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 3, false);
		//act
		var actualSelectionInfo = this.oSelectionHandler.getSelectionInfoFromEvent(inputEvent, false, this.aChartSelection);
		//assert
		assert.ok(areSetsEqual(actualSelectionInfo.dataPointsFromSelection, expectedSelectionInfo.dataPointsFromSelection, areDataPointsEqual), "selection info has all initial data points");
		assert.ok(areSetsEqual(actualSelectionInfo.aUniqueFilterValueFromChart, expectedSelectionInfo.aUniqueFilterValueFromChart), "selection info has all initial filter values");
	});
	//the selection handler has to look at each data point from the previous and the new selection
	QUnit.test("select multiple with duplicates", function(assert) {
		//arrange
		var inputEvent = {
			mParameters : {
				data : []
			}
		};
		pushToSelection(inputEvent.mParameters.data, 4, true);
		pushToSelection(inputEvent.mParameters.data, 5, true);
		pushToSelection(inputEvent.mParameters.data, 5, true);

		var expectedSelectionInfo = {
			dataPointsFromSelection : [],
			aUniqueFilterValueFromChart : [0, 1, 2, 3, 4, 5]
		};
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 0, false);
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 1, false);
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 2, false);
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 3, false);
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 4, false);
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 5, false);
		//act
		var actualSelectionInfo = this.oSelectionHandler.getSelectionInfoFromEvent(inputEvent, false, this.aChartSelection);
		//assert
		assert.ok(areSetsEqual(actualSelectionInfo.dataPointsFromSelection, expectedSelectionInfo.dataPointsFromSelection, areDataPointsEqual), "selection info has all unique data points");
		assert.ok(areSetsEqual(actualSelectionInfo.aUniqueFilterValueFromChart, expectedSelectionInfo.aUniqueFilterValueFromChart), "selection info has all unique filter values");
	});
	//the selection handler should be able to handle an empty deselection and hold the previous selection
	QUnit.test("deselect none", function(assert) {
		//arrange
		var inputEvent = {
			mParameters : {
				data : []
			}
		};

		var expectedSelectionInfo = {
			dataPointsFromSelection : [],
			aUniqueFilterValueFromChart : [0, 1, 2, 3]
		};
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 0, false);
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 1, false);
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 2, false);
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 3, false);
		//act
		var actualSelectionInfo = this.oSelectionHandler.getSelectionInfoFromEvent(inputEvent, true, this.aChartSelection);
		//assert
		assert.ok(areSetsEqual(actualSelectionInfo.dataPointsFromSelection, expectedSelectionInfo.dataPointsFromSelection, areDataPointsEqual), "selection info has all initial data points");
		assert.ok(areSetsEqual(actualSelectionInfo.aUniqueFilterValueFromChart, expectedSelectionInfo.aUniqueFilterValueFromChart), "selection info has all initial filter values");
	});
	//the selection handler has to look at each data point from the previous and the new selection
	QUnit.test("deselect multiple", function(assert) {
		//arrange
		var inputEvent = {
			mParameters : {
				data : []
			}
		};
		pushToSelection(inputEvent.mParameters.data, 2, true);
		pushToSelection(inputEvent.mParameters.data, 3, true);

		var expectedSelectionInfo = {
			dataPointsFromSelection : [],
			aUniqueFilterValueFromChart : [0, 1]
		};
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 0, false);
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 1, false);
		//act
		var actualSelectionInfo = this.oSelectionHandler.getSelectionInfoFromEvent(inputEvent, true, this.aChartSelection);
		//assert
		assert.ok(areSetsEqual(actualSelectionInfo.dataPointsFromSelection, expectedSelectionInfo.dataPointsFromSelection, areDataPointsEqual), "selection info has all remaining data points");
		assert.ok(areSetsEqual(actualSelectionInfo.aUniqueFilterValueFromChart, expectedSelectionInfo.aUniqueFilterValueFromChart), "selection info has all remaining filter values");
	});
	//the selection handler should be able to handle duplicates in deselection as well and just ignore data points that are already not included
	QUnit.test("deselect multiple with duplicates and not included", function(assert) {
		//arrange
		var inputEvent = {
			mParameters : {
				data : []
			}
		};
		pushToSelection(inputEvent.mParameters.data, -1, true);
		pushToSelection(inputEvent.mParameters.data, 2, true);
		pushToSelection(inputEvent.mParameters.data, 3, true);
		pushToSelection(inputEvent.mParameters.data, 3, true);

		var expectedSelectionInfo = {
			dataPointsFromSelection : [],
			aUniqueFilterValueFromChart : [0, 1]
		};
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 0, false);
		pushToSelection(expectedSelectionInfo.dataPointsFromSelection, 1, false);
		//act
		var actualSelectionInfo = this.oSelectionHandler.getSelectionInfoFromEvent(inputEvent, true, this.aChartSelection);
		//assert
		assert.ok(areSetsEqual(actualSelectionInfo.dataPointsFromSelection, expectedSelectionInfo.dataPointsFromSelection, areDataPointsEqual), "selection info has all remaining data points");
		assert.ok(areSetsEqual(actualSelectionInfo.aUniqueFilterValueFromChart, expectedSelectionInfo.aUniqueFilterValueFromChart), "selection info has all remaining filter values");
	});
	//the selection handler should be able to return to the empty chart selection
	QUnit.test("deselect all", function(assert) {
		//arrange
		var inputEvent = {
			mParameters : {
				data : []
			}
		};
		pushToSelection(inputEvent.mParameters.data, 0, true);
		pushToSelection(inputEvent.mParameters.data, 1, true);
		pushToSelection(inputEvent.mParameters.data, 2, true);
		pushToSelection(inputEvent.mParameters.data, 3, true);

		var expectedSelectionInfo = {
			dataPointsFromSelection : [],
			aUniqueFilterValueFromChart : []
		};
		//act
		var actualSelectionInfo = this.oSelectionHandler.getSelectionInfoFromEvent(inputEvent, true, this.aChartSelection);
		//assert
		assert.ok(areSetsEqual(actualSelectionInfo.dataPointsFromSelection, expectedSelectionInfo.dataPointsFromSelection, areDataPointsEqual), "selection info has no data points");
		assert.ok(areSetsEqual(actualSelectionInfo.aUniqueFilterValueFromChart, expectedSelectionInfo.aUniqueFilterValueFromChart), "selection info has no filter values");
	});
	
});