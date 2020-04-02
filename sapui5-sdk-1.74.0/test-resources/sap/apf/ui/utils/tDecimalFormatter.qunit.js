/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */

sap.ui.define('sap/apf/ui/utils/tDecimalFormatter', [
	'sap/apf/ui/utils/decimalFormatter'
],function(DecimalFormatter) {
	'use strict';

	function _getMetaData() {
		var newMetadata = {
			getPropertyMetadata : function(sPropertyName) {
				var metadata;
				switch (sPropertyName) {
					case "MaterialLength":
						metadata = {
							"name" : "Length of material",
							"dataType" : {
								"type" : "Edm.Decimal"
							},
							"aggregation-role" : "measure",
							"label" : "Material Length"
						};
						break;
					case "RevenueAmountInDisplayCrcy_E.CURRENCY":
						metadata = {
							"name" : "Length of material",
							"dataType" : {
								"type" : "Edm.Decimal"
							},
							"semantics" : "currency-code",
							"aggregation-role" : "measure",
							"label" : "Material Length"
						};
						break;
					case "RevenueAmountInDisplayCrcy_E":
						metadata = {
							"name" : "Length of material",
							"dataType" : {
								"type" : "Edm.Decimal"
							},
							"semantics" : "unit-of-measure",
							"aggregation-role" : "measure",
							"label" : "Material Length"
						};
						break;
					default:
						metadata = {};
						break;
				}
				return metadata;
			}
		};
		return newMetadata;
	}
	QUnit.module('Test for data type of Edm.Decimal', {
		beforeEach : function(assert) {
			this.formatter = new DecimalFormatter();
		}
	});
	QUnit.test("When semantics is undefined and precision is present", function(assert) {
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("MaterialLength"), 5467, 3);
		assert.strictEqual(formatedValue, "5,467.000", "Then since semantics is undefined so default formatter will be applied with given precision");
	});
	QUnit.test("When semantics is undefined and precision is undefined", function(assert) {
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("MaterialLength"), 5467);
		assert.strictEqual(formatedValue, "5,467", "Then since precision is undefined hence precision will not influence the value");
	});
	QUnit.test("When semantics is currency-code and precison is defined", function(assert) {
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("RevenueAmountInDisplayCrcy_E.CURRENCY"), 5467, 3);
		assert.strictEqual(formatedValue, "5,467.00", "Then since semantics is currency-code and precision is defined but in currecy formatter precision will not influence the currency value");
	});
	QUnit.test("When semantics is unit-of-measure(not supported) and precison is defined", function(assert) {
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("RevenueAmountInDisplayCrcy_E"), 5467, 3);
		assert.strictEqual(formatedValue, "5,467.000", "Then since semantics is unit-of-measure, default formatter is application with given precision");
	});
});
