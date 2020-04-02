/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */

sap.ui.define('sap/apf/ui/utils/tDateTimeFormatter', [
	'sap/apf/ui/utils/dateTimeFormatter',
	'sap/ui/core/format/DateFormat'
], function(DateTimeFormatter, DateFormat) {
	'use strict';

	function getPropertyMetadata (sPropertyName) {
		var metadata;
		switch (sPropertyName) {
		case "SapDisplayFormatDate":
			metadata = {
				"name" : "PostingDate_E",
				"sap:display-format" : "Date",
				"dataType" : {
					"type" : "Edm.DateTime"
				},
				"aggregation-role" : "dimension",
				"label" : "Posting Date"
		};
			break;
		case "SapDisplayFormatUndefined":
			metadata = {
				"name" : "PostingDate_E",
				"dataType" : {
					"type" : "Edm.DateTime"
				},
				"aggregation-role" : "dimension",
				"label" : "Posting Date"
		};
			break;
		case "UnsupportedDisplayFormat":
			metadata = {
				"name" : "PostingDate_E",
				"sap:display-format" : "UnsupportedDisplayFormat",
				"dataType" : {
					"type" : "Edm.DateTime"
				},
				"aggregation-role" : "dimension",
				"label" : "Posting Date"
		};
			break;
		default:
			metadata = {};
		break;
		}
		return metadata;
	}

	QUnit.module('Test for data type of Edm.DateTime', {
		beforeEach : function(assert) {
			this.formatter = new DateTimeFormatter();
		}
	});
	QUnit.test("When fieldValue is instance of Date & sap:display-format is Date", function(assert) {
		var fieldValue = new Date(Date.UTC(2012,11,11));
		var dateFormatter = DateFormat.getDateInstance({
			style : "short"
		});
		var dateFormat = dateFormatter.format(fieldValue, true);
		var formatedValue = this.formatter.getFormattedValue(getPropertyMetadata("SapDisplayFormatDate"), fieldValue);
		assert.strictEqual(formatedValue, dateFormat, "Then since display format is Date so formatted the given value as date of UI5 Date");
	});
	QUnit.test("When fieldValue is instance of Date & sap:display-format is undefined", function(assert) {
		var fieldValue = new Date("01/02/2013");
		var formatedValue = this.formatter.getFormattedValue(getPropertyMetadata("SapDisplayFormatUndefined"), fieldValue);
		assert.strictEqual(formatedValue.toString(), fieldValue.toString(), "Then since display format is undefined so returned the original field value");
	});
	QUnit.test("When fieldValue is instance of Date & sap:display-format is not supported", function(assert) {
		var fieldValue = new Date("01/02/2013");
		var formatedValue = this.formatter.getFormattedValue(getPropertyMetadata("UnsupportedDisplayFormat"), fieldValue);
		assert.strictEqual(formatedValue.toString(), fieldValue.toString(), "Then since display format is not supported so returned the original field value");
	});
	QUnit.test("When fieldValue is not instance of Date but can be converted as instance of Date & sap:display-format is Date", function(assert) {
		var fieldValue = "01/02/2013";
		var convertedFieldValue = new Date("01/02/2013");
		var dateFormatter = DateFormat.getDateInstance({
			style : "short"
		});
		var dateFormat = dateFormatter.format(convertedFieldValue, true);
		var formatedValue = this.formatter.getFormattedValue(getPropertyMetadata("SapDisplayFormatDate"), fieldValue);
		assert.strictEqual(formatedValue, dateFormat, "Then since display format is Date so formatted the given value as date of UI5 Date");
	});
	QUnit.test("When fieldValue is not instance of Date", function(assert) {
		var fieldValue = "/Date(12345)/";
		var formatedValue = this.formatter.getFormattedValue(getPropertyMetadata("SapDisplayFormatUndefined"), fieldValue);
		assert.strictEqual(formatedValue, "-", "Then since value is not instance of date so returned invalid date symbol hypen(-)");
	});
});
