/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */

sap.ui.define('sap/apf/ui/utils/tTimeFormatter', [
	'sap/apf/ui/utils/timeFormatter'
], function(TimeFormatter) {
	'use strict';

	function _getMetaData() {
		var newMetadata = {
			getPropertyMetadata : function(sPropertyName) {
				var metadata;
				switch (sPropertyName) {
					case "TimeOfADay":
						metadata = {
							"name" : "TimeOfADay",
							"dataType" : {
								"type" : "Edm.Time"
							},
							"aggregation-role" : "dimension",
							"label" : "Departure Time"
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
	QUnit.module('Test for data type of Edm.Time', {
		beforeEach : function() {
			this.formatter = new TimeFormatter();
		}
	});
	QUnit.test("When original value has the object with value of ms", function(assert) {
		var DepartureTime = {
			__edmType : "Edm.Time",
			ms : 24025000
		};
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("TimeOfADay"), DepartureTime);
		assert.strictEqual(formatedValue, "6:40:25 AM", "Then since original field value is object with ms value so formatted using oData time formatter");
	});
	QUnit.test("When original value has the value of time of day", function(assert) {
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("TimeOfADay"), "13:20:12");
		assert.strictEqual(formatedValue, "13:20:12", "Then since original field value is direct representation of time of day so representated the value as time of day itself");
	});
});
