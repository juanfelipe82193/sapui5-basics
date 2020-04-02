/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.declare('sap.apf.ui.utils.tFacetFilterListConverter');
jQuery.sap.require('sap.apf.ui.utils.facetFilterListConverter');
(function() {
	"use strict";
	QUnit.module("Facet Filter List Converter tests", {
		beforeEach : function() {
			this.oFacetFilterListConverter = new sap.apf.ui.utils.FacetFilterListConverter();
		}
	});
	QUnit.test("No selected values", function(assert) {
		// arrangement
		var sPropertyName = "StartDate";
		var aFilterValues = [ {
			"StartDate" : "20000101",
			"formattedValue" : "1/1/2000"
		}, {
			"StartDate" : "20000201",
			"formattedValue" : "2/1/2000"
		}];
		var aExpectedFacetFilterItems = [ {
			"key" : "20000101",
			"text" : "1/1/2000",
			"selected" : false
		}, {
			"key" : "20000201",
			"text" : "2/1/2000",
			"selected" : false
		}];
		// act
		var aModifiedFilters = this.oFacetFilterListConverter.getFFListDataFromFilterValues(aFilterValues, sPropertyName);
		assert.deepEqual(aModifiedFilters, aExpectedFacetFilterItems, "Correct list items are formed");
	});
	QUnit.test("Selected values is empty array", function(assert) {
		// arrangement
		var sPropertyName = "StartDate";
		var aFilterValues = [ {
			"StartDate" : "20000101",
			"formattedValue" : "1/1/2000"
		}, {
			"StartDate" : "20000201",
			"formattedValue" : "2/1/2000"
		}];
		var aExpectedFacetFilterItems = [ {
			"key" : "20000101",
			"text" : "1/1/2000",
			"selected" : false
		}, {
			"key" : "20000201",
			"text" : "2/1/2000",
			"selected" : false
		} ];
		// act
		var aModifiedFilters = this.oFacetFilterListConverter.getFFListDataFromFilterValues(aFilterValues, sPropertyName, []);
		assert.deepEqual(aModifiedFilters, aExpectedFacetFilterItems, "Correct list items are formed");
	});
	QUnit.test("One element is selected", function(assert) {
		// arrangement
		var sPropertyName = "StartDate";
		var aFilterValues = [ {
			"StartDate" : "20000101",
			"formattedValue" : "1/1/2000"
		}, {
			"StartDate" : "20000201",
			"formattedValue" : "2/1/2000"
		}];
		var aExpectedFacetFilterItems = [ {
			"key" : "20000101",
			"text" : "1/1/2000",
			"selected" : true
		}, {
			"key" : "20000201",
			"text" : "2/1/2000",
			"selected" : false
		} ];
		// act
		var aModifiedFilters = this.oFacetFilterListConverter.getFFListDataFromFilterValues(aFilterValues, sPropertyName, ["20000101"]);
		assert.deepEqual(aModifiedFilters, aExpectedFacetFilterItems, "Correct list items are formed");
	});
	QUnit.test("All elements are selected", function(assert) {
		// arrangement
		var sPropertyName = "StartDate";
		var aFilterValues = [ {
			"StartDate" : "20000101",
			"formattedValue" : "1/1/2000"
		}, {
			"StartDate" : "20000201",
			"formattedValue" : "2/1/2000"
		}];
		var aExpectedFacetFilterItems = [ {
			"key" : "20000101",
			"text" : "1/1/2000",
			"selected" : true
		}, {
			"key" : "20000201",
			"text" : "2/1/2000",
			"selected" : true
		} ];
		// act
		var aModifiedFilters = this.oFacetFilterListConverter.getFFListDataFromFilterValues(aFilterValues, sPropertyName, ["20000101", "20000201"]);
		assert.deepEqual(aModifiedFilters, aExpectedFacetFilterItems, "Correct list items are formed");
	});
	QUnit.test("Values are string format and selection is integer", function(assert) {
		// arrangement
		var sPropertyName = "StringProperty";
		var aFilterValues = [ {
			"StringProperty" : "1",
			"formattedValue" : "text:1"
		}, {
			"StringProperty" : "2",
			"formattedValue" : "text:2"
		}];
		var aExpectedFacetFilterItems = [ {
			"key" : "1",
			"text" : "text:1",
			"selected" : true
		}, {
			"key" : "2",
			"text" : "text:2",
			"selected" : false
		} ];
		// act
		var aModifiedFilters = this.oFacetFilterListConverter.getFFListDataFromFilterValues(aFilterValues, sPropertyName, [1]);
		assert.deepEqual(aModifiedFilters, aExpectedFacetFilterItems, "Correct list items are formed");
	});
	QUnit.test("Values are integer format and selection is string", function(assert) {
		// arrangement
		var sPropertyName = "StringProperty";
		var aFilterValues = [ {
			"StringProperty" : 1,
			"formattedValue" : "text:1"
		}, {
			"StringProperty" : 2,
			"formattedValue" : "text:2"
		}];
		var aExpectedFacetFilterItems = [ {
			"key" : 1,
			"text" : "text:1",
			"selected" : true
		}, {
			"key" : 2,
			"text" : "text:2",
			"selected" : false
		} ];
		// act
		var aModifiedFilters = this.oFacetFilterListConverter.getFFListDataFromFilterValues(aFilterValues, sPropertyName, ["1"]);
		assert.deepEqual(aModifiedFilters, aExpectedFacetFilterItems, "Correct list items are formed");
	});
	QUnit.test("Values are Dates and selection is string", function(assert) {
		// arrangement
		var sPropertyName = "StringProperty";
		var aFilterValues = [ {
			"StringProperty" : new Date(Date.UTC(2014, 11, 20)), // Date instance
			"formattedValue" : "text:1"
		}, {
			"StringProperty" : new Date(Date.UTC(2014, 3, 20)), // Date instance
			"formattedValue" : "text:2"
		}];
		var aExpectedFacetFilterItems = [ {
			"key" : new Date(Date.UTC(2014, 11, 20)), // Date instance
			"text" : "text:1",
			"selected" : true
		}, {
			"key" : new Date(Date.UTC(2014, 3, 20)), // Date instance
			"text" : "text:2",
			"selected" : false
		} ];
		// act
		var aModifiedFilters = this.oFacetFilterListConverter.getFFListDataFromFilterValues(aFilterValues, sPropertyName, [new Date(Date.UTC(2014, 11, 20)) + ""]); //Selection is string
		assert.deepEqual(aModifiedFilters, aExpectedFacetFilterItems, "Correct list items are formed");
	});
	QUnit.test("Values are String and selection is date", function(assert) {
		// arrangement
		var sPropertyName = "StringProperty";
		var aFilterValues = [ {
			"StringProperty" : new Date(Date.UTC(2014, 11, 20)) + "", // Date instance as string
			"formattedValue" : "text:1"
		}, {
			"StringProperty" : new Date(Date.UTC(2014, 3, 20)) + "", // Date instance as string
			"formattedValue" : "text:2"
		}];
		var aExpectedFacetFilterItems = [ {
			"key" : new Date(Date.UTC(2014, 11, 20)) + "", // Date instance as string
			"text" : "text:1",
			"selected" : true
		}, {
			"key" : new Date(Date.UTC(2014, 3, 20)) + "", // Date instance as string
			"text" : "text:2",
			"selected" : false
		} ];
		// act
		var aModifiedFilters = this.oFacetFilterListConverter.getFFListDataFromFilterValues(aFilterValues, sPropertyName, [new Date(Date.UTC(2014, 11, 20))]); // Selection is Date instance
		assert.deepEqual(aModifiedFilters, aExpectedFacetFilterItems, "Correct list items are formed");
	});
	QUnit.test("Values are Dates and selection is Date", function(assert) {
		// arrangement
		var sPropertyName = "StringProperty";
		var aFilterValues = [ {
			"StringProperty" : new Date(Date.UTC(2014, 11, 20)),
			"formattedValue" : "text:1"
		}, {
			"StringProperty" : new Date(Date.UTC(2014, 3, 20)),
			"formattedValue" : "text:2"
		}];
		var aExpectedFacetFilterItems = [ {
			"key" : new Date(Date.UTC(2014, 11, 20)),
			"text" : "text:1",
			"selected" : true
		}, {
			"key" : new Date(Date.UTC(2014, 3, 20)),
			"text" : "text:2",
			"selected" : false
		} ];
		// act
		var aModifiedFilters = this.oFacetFilterListConverter.getFFListDataFromFilterValues(aFilterValues, sPropertyName, [new Date(Date.UTC(2014, 11, 20))]);
		assert.deepEqual(aModifiedFilters, aExpectedFacetFilterItems, "Correct list items are formed");
	});
}());
