/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2017 SAP SE. All rights reserved
 */
/* global sap, jQuery, QUnit, sinon */
jQuery.sap.require('sap.apf.ui.representations.utils.representationFilterHandler');
jQuery.sap.require('sap.apf.ui.representations.utils.timeAxisDateConverter');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.registerModulePath('sap.apf.integration', '../../../integration');
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.createUiApiAsPromise");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.require('sap.apf.testhelper.config.representationHelper');
jQuery.sap.require("sap.apf.ui.utils.formatter");
(function() {
	"use strict";
	var oRepresentationFilterHandler,
		oRepresentationHelper,
		aSampleData;
	function _getsampleMetadata() {
		return {
			getPropertyMetadata : oRepresentationHelper.setPropertyMetadataStub.call()
		};
	}
	QUnit.module("Representation Filter Handler", {
		beforeEach : function(assert) {
			var done = assert.async();
			var oTestInstance = this;
			sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(oGlobalApi) {
				oTestInstance.oGlobalApi = oGlobalApi;
				aSampleData = sap.apf.testhelper.odata.getSampleService(oTestInstance.oGlobalApi.oApi, 'sampleData');
				oRepresentationHelper = sap.apf.testhelper.config.representationHelper.prototype;
				oTestInstance.requiredParamter = oRepresentationHelper.selectableRepresentationDataWithDimension();
				oTestInstance.requiredParamter.requiredFilters = [ "CompanyCodeCountry" ];
				oTestInstance.requiredParamter["requiredFilterOptions"] = {
					"labelDisplayOption" : "text"
				};
				var oTimeAxisDateConverter = new sap.apf.ui.representations.utils.TimeAxisDateConverter();
				oRepresentationFilterHandler = new sap.apf.ui.representations.utils.RepresentationFilterHandler(oTestInstance.oGlobalApi.oApi, oTestInstance.requiredParamter, oTimeAxisDateConverter);
				done();
			});
		},
		afterEach : function(assert) {
			delete (this.requiredParamter.requiredFilterOptions);
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When initializing representation filter handler", function(assert) {
		assert.notEqual(oRepresentationFilterHandler, undefined, "then instance of representation filter handler is created");
		assert.strictEqual(oRepresentationFilterHandler.aFilterValues.length, 0, "then filter value is an empty array");
		assert.notEqual(oRepresentationFilterHandler.oApi, undefined, "then oApi is available");
		assert.notEqual(oRepresentationFilterHandler.oParameter, undefined, "then oParameter is available");
		assert.deepEqual(oRepresentationFilterHandler.filterValueLookup, {}, "then filter value lookup is empty");
		assert.notEqual(oRepresentationFilterHandler.oDisplayOptionHandler, undefined, "then instance of display option handler is created");
		assert.notEqual(oRepresentationFilterHandler.oTimeAxisDateConverter, undefined, "then instance of time axis date converter is created");
	});
	QUnit.test("When updateFilterFromSelection is called with filter values and then filter is cleared", function(assert) {
		var aFilterValues = [ "AR", "AT", "KR" ];
		var spyGetIfSelectedFilterChanged = sinon.spy(oRepresentationFilterHandler, "getIfSelectedFilterChanged");
		assert.strictEqual(oRepresentationFilterHandler.getIfSelectedFilterChanged([]), false, "then getIfSelectedFilterChanged returns false when there are no filters");
		oRepresentationFilterHandler.updateFilterFromSelection(aFilterValues);
		assert.strictEqual(oRepresentationFilterHandler.getIfSelectedFilterChanged(aFilterValues), false, "then getIfSelectedFilterChanged returns false when when filter changed");
		assert.strictEqual(oRepresentationFilterHandler.aFilterValues.length, 3, "then filter value length is correct");
		assert.deepEqual(oRepresentationFilterHandler.aFilterValues, aFilterValues, "then correct filter value is set");
		assert.deepEqual(oRepresentationFilterHandler.getFilterValues(), aFilterValues, "then getFilterValues returns correct filter value");
		assert.strictEqual(spyGetIfSelectedFilterChanged.called, true, "then getIfSelectedFilterChanged is called");
		//duplicate filter values
		oRepresentationFilterHandler.updateFilterFromSelection(aFilterValues);
		assert.strictEqual(oRepresentationFilterHandler.getIfSelectedFilterChanged(aFilterValues), false, "then getIfSelectedFilterChanged returns false when duplicate filters are sent");
		assert.deepEqual(oRepresentationFilterHandler.aFilterValues, aFilterValues, "then current filter is same as the previous value if duplicate value is sent");
		assert.deepEqual(oRepresentationFilterHandler.getFilterValues(), aFilterValues, "then getFilterValues returns correct filter value");
		oRepresentationFilterHandler.clearFilters();
		assert.strictEqual(oRepresentationFilterHandler.aFilterValues.length, 0, "then filter value length is set to zero");
	});
	QUnit.test("When getDisplayInfoForFilters is called", function(assert) {
		var aFilterValues = [ "AR", "AT", "KR" ];
		var oExpectedFilterValueLookup = {
			"AR" : "Argentina",
			"AT" : "Austria",
			"KR" : "South Korea"
		};
		var aExpectedDisplayInfoForFilters = [ {
			"id" : "AR",
			"text" : "Argentina"
		}, {
			"id" : "AT",
			"text" : "Austria"
		}, {
			"id" : "KR",
			"text" : "South Korea"
		} ];
		var spy = sinon.spy(sap.apf.utils, "convertToExternalFormat");
		oRepresentationFilterHandler.updateFilterFromSelection(aFilterValues);
		var aDisplayInfoForFilters = oRepresentationFilterHandler.getDisplayInfoForFilters(_getsampleMetadata(), aSampleData);
		assert.deepEqual(oRepresentationFilterHandler.filterValueLookup, oExpectedFilterValueLookup, "then correct lookup is created for filters");
		assert.deepEqual(aDisplayInfoForFilters, aExpectedDisplayInfoForFilters, "then the correct display information for filters is created");
		assert.ok(spy.calledThrice, "THEN conversion function was called 3 times");
		var spyCalls = spy.getCalls();
		assert.equal(spyCalls[0].args[0], "Argentina", "Expected value for formatting");
		assert.equal(spyCalls[0].args[1].getAttribute("name"), "CompanyCodeCountryName", "Expected fieldname, that has been handed over for the text property");
		assert.equal(spyCalls[1].args[0], "Austria", "Expected value for formatting");
		assert.equal(spyCalls[2].args[0], "South Korea", "Expected value for formatting");
		spy.restore();
	});
	QUnit.test("When getDisplayInfoForFilters is called for property with formatted- field", function(assert) {
		var spy = sinon.spy(sap.apf.utils, "convertToExternalFormat");
		var aFilterValues = [ "AR", "AT", "KR" ];
		var oExpectedFilterValueLookup = {
			"AR" : "formatted_Argentina",
			"AT" : "formatted_Austria",
			"KR" : "formatted_South Korea"
		};
		var aExpectedDisplayInfoForFilters = [ {
			"id" : "AR",
			"text" : "formatted_Argentina"
		}, {
			"id" : "AT",
			"text" : "formatted_Austria"
		}, {
			"id" : "KR",
			"text" : "formatted_South Korea"
		} ];
		aSampleData.forEach(function(data){
			data["formatted_CompanyCodeCountryName"] = "formatted_" + data["CompanyCodeCountryName"];
		});
		oRepresentationFilterHandler.updateFilterFromSelection(aFilterValues);
		var aDisplayInfoForFilters = oRepresentationFilterHandler.getDisplayInfoForFilters(_getsampleMetadata(), aSampleData);
		assert.deepEqual(oRepresentationFilterHandler.filterValueLookup, oExpectedFilterValueLookup, "then correct lookup is created for filters");
		assert.deepEqual(aDisplayInfoForFilters, aExpectedDisplayInfoForFilters, "then the correct display information for filters is created");
		var spyCalls = spy.getCalls();
		assert.equal(spyCalls.length, 0, "THEN formatter was not called");
		spy.restore();
	});
	QUnit.test("When getDisplayInforForFilters is called without required filter property", function(assert){
		oRepresentationFilterHandler.oParameter.requiredFilters = [];
		var aDisplayInfoForFilters = oRepresentationFilterHandler.getDisplayInfoForFilters(_getsampleMetadata(), aSampleData);
		assert.deepEqual(oRepresentationFilterHandler.filterValueLookup, {}, "then empty lookup is created for filters");
		assert.deepEqual(aDisplayInfoForFilters, [], "then an empty array is returned");
	});
	QUnit.test("When createFilterFromSelectedValues is called", function(assert) {
		var aFilterValues = [ "AR", "AT", "KR" ];
		var spyCreateFilter = sinon.spy(oRepresentationFilterHandler.oApi, "createFilter");
		oRepresentationFilterHandler.updateFilterFromSelection(aFilterValues);
		var oFilter = oRepresentationFilterHandler.createFilterFromSelectedValues();
		var aFilterValueFromCore = [];
		oFilter.getInternalFilter().getFilterTerms().forEach(function(oFilterTerm) {
			aFilterValueFromCore.push(oFilterTerm.getValue());
		});
		assert.deepEqual(spyCreateFilter.called, true, "then create filter is called");
		assert.deepEqual(oFilter.getInternalFilter().getFilterTerms().length, 3, "then correct filter is created");
		assert.deepEqual(aFilterValueFromCore, aFilterValues, "then correct filter is set to core");
	});
	QUnit.test("When createFilterFromSelectedValues is called with some filter values which are same as available filter values", function(assert) {
		var aFilterValues = [ "AR", "AT", "KR" ];
		var spyCreateFilter = sinon.spy(oRepresentationFilterHandler.oApi, "createFilter");
		oRepresentationFilterHandler.updateFilterFromSelection(aFilterValues);
		var oFilter = oRepresentationFilterHandler.createFilterFromSelectedValues(["AR"]);
		var aFilterValueFromCore = [];
		oFilter.getInternalFilter().getFilterTerms().forEach(function(oFilterTerm) {
			aFilterValueFromCore.push(oFilterTerm.getValue());
		});
		assert.deepEqual(spyCreateFilter.called, true, "then create filter is called");
		assert.deepEqual(oFilter.getInternalFilter().getFilterTerms().length, 3, "then correct filter is created");
		assert.deepEqual(aFilterValueFromCore, aFilterValues, "then correct filter is set to core");
	});
	QUnit.test("When createFilterFromSelectedValues is called with some filter values which are different from available filter values", function(assert) {
		var aFilterValues = [ "AR", "AT", "KR" ];
		var spyCreateFilter = sinon.spy(oRepresentationFilterHandler.oApi, "createFilter");
		oRepresentationFilterHandler.updateFilterFromSelection(aFilterValues);
		var oFilter = oRepresentationFilterHandler.createFilterFromSelectedValues([ "DE" ]);
		var aFilterValueFromCore = [];
		var aExpectedFilterValues = [ "DE", "AR", "AT", "KR" ];
		oFilter.getInternalFilter().getFilterTerms().forEach(function(oFilterTerm) {
			aFilterValueFromCore.push(oFilterTerm.getValue());
		});
		assert.deepEqual(spyCreateFilter.called, true, "then create filter is called");
		assert.deepEqual(oFilter.getInternalFilter().getFilterTerms().length, 4, "then correct filter is created");
		assert.deepEqual(aFilterValueFromCore, aExpectedFilterValues, "then correct filter is set to core");
	});
	QUnit.module("validateFiltersWithDataset", {
		beforeEach: function(){
			this.oRepresentationFilterHandler = new sap.apf.ui.representations.utils.RepresentationFilterHandler({}, {requiredFilters : ["Customer"]});
			this.oRepresentationFilterHandler.aDataResponse = [{
				Customer : "A",
				Product : "1"
			}, {
				Customer : "B",
				Product : "2"
			}];
		}
	});
	QUnit.test("When all filter values are in dataset", function(assert) {
		var aFilterValues = ["A", "B"];
		this.oRepresentationFilterHandler.aFilterValues = aFilterValues;
		this.oRepresentationFilterHandler.validateFiltersWithDataset();
		assert.deepEqual(this.oRepresentationFilterHandler.aFilterValues, aFilterValues, "Filter values have not been changed");
	});
	QUnit.test("When some filter values are in dataset", function(assert) {
		var aFilterValues = ["A", "2"];
		var aExpectedFilterValues = ["A"];
		this.oRepresentationFilterHandler.aFilterValues = aFilterValues;
		this.oRepresentationFilterHandler.validateFiltersWithDataset();
		assert.deepEqual(this.oRepresentationFilterHandler.aFilterValues, aExpectedFilterValues, "Filter that is no longer in dataset has been removed");
	});
	QUnit.test("When no filter values are in dataset", function(assert) {
		var aFilterValues = ["1", "2"];
		this.oRepresentationFilterHandler.aFilterValues = aFilterValues;
		this.oRepresentationFilterHandler.validateFiltersWithDataset();
		assert.deepEqual(this.oRepresentationFilterHandler.aFilterValues, [], "Filter values is now empty");
	});

	QUnit.module("Representation Filter Handler get if selected filter changed", {
		beforeEach : function(assert) {
			var done = assert.async();
			var testEnv = this;

			sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(oApi) {
				var parameter = {
					requiredFilters : ["property1"]
				};
				testEnv.oGlobalApi = oApi;
				testEnv.oRepresentationFilterHandler = new sap.apf.ui.representations.utils.RepresentationFilterHandler(oApi, parameter);
				done();
			});
		},
		afterEach : function(assert) {
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("when called with no given filters and no new filters", function(assert) {
		//arrange
		this.oRepresentationFilterHandler.aFilterValues = [];
		//act
		var outputChanged = this.oRepresentationFilterHandler.getIfSelectedFilterChanged([]);
		//assert
		assert.strictEqual(outputChanged, false, "then the selected filter values haven't changed");
	});
	QUnit.test("when called with no given filters and new filters", function(assert) {
		//arrange
		this.oRepresentationFilterHandler.aFilterValues = [];
		//act
		var outputChanged = this.oRepresentationFilterHandler.getIfSelectedFilterChanged(["filter1", "filter2"]);
		//assert
		assert.strictEqual(outputChanged, true, "then the selected filter values have changed");
	});
	QUnit.test("when called with given filters and no new filters", function(assert) {
		//arrange
		this.oRepresentationFilterHandler.aFilterValues = ["filter1", "filter2"];
		//act
		var outputChanged = this.oRepresentationFilterHandler.getIfSelectedFilterChanged([]);
		//assert
		assert.strictEqual(outputChanged, true, "then the selected filter values have changed");
	});
	QUnit.test("when called with given filters and new filters, which are the same as the given filters, but with duplicates", function(assert) {
		//arrange
		this.oRepresentationFilterHandler.aFilterValues = ["filter1", "filter2"];
		//act
		var outputChanged = this.oRepresentationFilterHandler.getIfSelectedFilterChanged(["filter1", "filter2", "filter1"]);
		//assert
		assert.strictEqual(outputChanged, false, "then the (unique) selected filter values haven't changed");
	});
	QUnit.test("when called with given filters and more new filters", function(assert) {
		//arrange
		this.oRepresentationFilterHandler.aFilterValues = ["filter1", "filter2"];
		//act
		var outputChanged = this.oRepresentationFilterHandler.getIfSelectedFilterChanged(["filter3", "filter4"]);
		//assert
		assert.strictEqual(outputChanged, true, "then the selected filter values have changed");
	});
})();