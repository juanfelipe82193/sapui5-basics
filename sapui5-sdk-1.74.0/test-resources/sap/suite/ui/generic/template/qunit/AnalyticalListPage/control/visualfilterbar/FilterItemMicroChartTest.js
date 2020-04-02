/*
* tests for the sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicroChart
*/
sap.ui.define(
	[ "sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/FilterItemMicroChart" ], function(FilterItemMicroChart) {
		"use strict";

		var  oFilterItemMicroChart = FilterItemMicroChart.prototype;

		/**
		* prototype mock to return selected DateTime filed
		*/
		oFilterItemMicroChart._isDateTimeFieldSelected = function() {
			return false;
		}

		/**
		* prototype mock to return Currency filed
		*/
		oFilterItemMicroChart.getUnitField = function() {
			return "Currency"
		}

		/**
		* QUnit test cases for _determineUnit() function.
		*/

		QUnit.test("determineUnit function test", function( assert ) {
			/**
			* This function is wrapper to call _determineUnit of FilterItemMicroChart
			* @param mock data
			* @return multiUnit value
			*/
			function determineUnit(data) {
				var funHold = oFilterItemMicroChart._applyUnitValue;
				oFilterItemMicroChart._applyUnitValue = function (value) { };
				oFilterItemMicroChart._determineUnit(data);
				oFilterItemMicroChart._applyUnitValue = funHold;
				return oFilterItemMicroChart._multiUnit;
			}

			//Assertions for Qunit
			assert.equal(determineUnit([{"Currency":"USD"},{"Currency":"USD"},{"Currency":"USD"}]), false);
			assert.equal(determineUnit([{"Currency":"EUR"},{"Currency":"USD"},{"Currency":"USD"}]), true);
			assert.equal(determineUnit([{"Currency":"USD"},{"Currency":"EUR"},{"Currency":"USD"}]), true);
			assert.equal(determineUnit([{"Currency":"USD"},{"Currency":"USD"},{"Currency":""}]), true);
			assert.equal(determineUnit([{"Currency":""},{"Currency":""},{"Currency":""}]), false);
			assert.equal(determineUnit([{},{"Currency":"USD"},{"Currency":"USD"}]), true);
			assert.equal(determineUnit([{"Currency":""},{"Currency":""},{"Currency":""}]), false);
			assert.equal(determineUnit([{"Currency":"USD"},{}]), true);
			assert.equal(determineUnit([{"Currency":""}]), false);
			assert.equal(determineUnit([{"Currency":"USD"},{"Currency":"EUR"}]), true);
			assert.equal(determineUnit([{"Currency":"EUR"},{"Currency":"EUR"},{}]), true);
			assert.equal(determineUnit([{"Currency":"EUR"},{"Currency":"EUR"},{"dimensionValue":"__IS_OTHER__"}]), false);
			assert.equal(determineUnit([{"Currency":"EUR"},{"Currency":"USD"},{"dimensionValue":"__IS_OTHER__"}]), true);

		});

		/*
		 * Function to check
		 *
		 *
		 *
		*/
		QUnit.test("_getSelected function test for filter restriction single", function( assert ) {
			var sFilterData = "10000009";

			oFilterItemMicroChart.getFilterRestriction = function() {
				return "single"
			};
			assert.equal(oFilterItemMicroChart._getSelected(sFilterData, "10000009"), true);
			assert.equal(oFilterItemMicroChart._getSelected(sFilterData, "10000007"), false);
			assert.equal(oFilterItemMicroChart._getSelected(sFilterData, "10000006"), false);
			assert.equal(oFilterItemMicroChart._getSelected(sFilterData, "10000001"), false);
			assert.equal(oFilterItemMicroChart._getSelected(sFilterData, "10000005"), false);
			//Assertions for Qunit

		});

		QUnit.test("_getSelected function test for filter restriction multiple", function( assert ) {
			var oFilterData = {
				items: [{
					key: "10000009",
					text: "Nestle"
				}],
				ranges: [{
					exclude:false,
					operation:"EQ",
					keyField: "CostCenter",
					value1: "10000007"
				}, {
					exclude:false,
					operation:"GT",
					keyField: "CostCenter",
					value1: "10000005"
				}, {
					exclude:false,
					operation:"BT",
					keyField: "CostCenter",
					value1: "10000005",
					value2: "10000004"
				}],
				value: "10000006"
			};

			oFilterItemMicroChart.getFilterRestriction = function() {
				return "multiple"
			};
			assert.equal(oFilterItemMicroChart._getSelected(oFilterData, "10000009"), true);
			assert.equal(oFilterItemMicroChart._getSelected(oFilterData, "10000007"), true);
			assert.equal(oFilterItemMicroChart._getSelected(oFilterData, "10000006"), true);
			assert.equal(oFilterItemMicroChart._getSelected(oFilterData, "10000004"), false);
			assert.equal(oFilterItemMicroChart._getSelected(oFilterData, "10000005"), false);
			//Assertions for Qunit
		});
		QUnit.test("_getSelected function test for filter restriction multiple - Other's Selection", function( assert ) {
			oFilterItemMicroChart._chart = {
				getSegments: function() {
					return [{
						getCustomData: function() {
							return [{
								getValue: function () {
									return "10000007";
								}
							}];
						}					
					}, {
						getCustomData: function() {
							return [{
								getValue: function () {
									return "10000006";
								}
							}];
						}					
					}];
				}
			};
			oFilterItemMicroChart.getFilterRestriction = function() {
				return "multiple"
			};

			var oFilterData = {
				items: [],
				ranges: [{
					exclude:true,
					operation:"EQ",
					keyField: "CostCenter",
					value1: "10000007"
				}, {
					exclude:true,
					operation:"EQ",
					keyField: "CostCenter",
					value1: "10000006"
				}],
				value: null
			};
			assert.equal(oFilterItemMicroChart._getSelected(oFilterData, "__IS_OTHER__"), true);

			var oFilterData = {
				items: [],
				ranges: [{
					exclude:true,
					operation:"EQ",
					keyField: "CostCenter",
					value1: "10000009"
				}, {
					exclude:true,
					operation:"EQ",
					keyField: "CostCenter",
					value1: "10000006"
				}],
				value: null
			};

			assert.equal(oFilterItemMicroChart._getSelected(oFilterData, "__IS_OTHER__"), false);

			var oFilterData = {
				items: [],
				ranges: [{
					exclude:true,
					operation:"EQ",
					keyField: "CostCenter",
					value1: "10000009"
				}, {
					exclude:true,
					operation:"EQ",
					keyField: "CostCenter",
					value1: "10000007"
				}, {
					exclude:true,
					operation:"EQ",
					keyField: "CostCenter",
					value1: "10000006"
				}],
				value: null
			};

			assert.equal(oFilterItemMicroChart._getSelected(oFilterData, "__IS_OTHER__"), false);

			var oFilterData = {
				items: [],
				ranges: [{
					exclude:true,
					operation:"EQ",
					keyField: "CostCenter",
					value1: "10000006"
				}],
				value: null
			};

			assert.equal(oFilterItemMicroChart._getSelected(oFilterData, "__IS_OTHER__"), false);

			var oFilterData = {
				items: [],
				ranges: [],
				value: null
			};

			assert.equal(oFilterItemMicroChart._getSelected(oFilterData, "__IS_OTHER__"), false);
		});
	}
);
