/*
 *Tests for the sap.suite.ui.generic.template.AnalyticalListPage.controller.fbc
 */
 sap.ui.define(
	["sap/suite/ui/generic/template/AnalyticalListPage/controller/FilterBarController",
	"sap/ui/comp/smartfilterbar/SmartFilterBar"
	],
	function(FilterBarController, SmartFilterBar) {
		"use strict";
		var oFilterBarController = new FilterBarController(this);
		/**
		 * Test cases to be passed into _modifyCompactFilterData().
		*/
		function propertyData() {
			this.items = [];
			this.ranges = [];
			this.value = null;
		}
		QUnit.test("Modifying compact filter data", function(assert) {
			var aFilterList = [{
				"dimValue": "100-1100",
				"dimValueDisplay": "Consulting Canada"
			}];
			var sFilterRestriction = undefined;
			var sProperty = "CostCenter";
			var oExpected = new propertyData();
			oExpected.items.push({
				key: "100-1100",
				text: "Consulting Canada (100-1100)"
			});
			var inputData = new propertyData();
			//multi valued restriction
			assert.deepEqual(oFilterBarController._modifyCompactFilterData(aFilterList, sFilterRestriction, sProperty, inputData), oExpected);
			//single valued
			assert.deepEqual(oFilterBarController._modifyCompactFilterData(aFilterList, "single-value", sProperty, inputData), "100-1100");
			//intervals
			assert.deepEqual(oFilterBarController._modifyCompactFilterData(aFilterList, "interval", sProperty, inputData), "100-1100");
		});
	}
);