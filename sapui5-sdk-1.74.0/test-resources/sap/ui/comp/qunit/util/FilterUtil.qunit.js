/* global QUnit */
(function() {
	"use strict";

	QUnit.config.autostart = false;

	sap.ui.define([
		"sap/ui/comp/util/FilterUtil"
	], function(FilterUtil) {

		QUnit.module("getTransformedExcludeOperation");

		QUnit.test("Operations should be transformed correctly", function (assert) {
			// Arrange
			var oExpectedResults = {
				"EQ": "NE",
				"GE": "LT",
				"LT": "GE",
				"LE": "GT",
				"GT": "LE",
				"BT": "NB",
				"Contains": "NotContains",
				"StartsWith": "NotStartsWith",
				"EndsWith": "NotEndsWith"
			};
			assert.expect(9);

			// Assert
			Object.keys(oExpectedResults).forEach(function (sOperation) {
				var sResultOperation = oExpectedResults[sOperation];
				assert.strictEqual(
					FilterUtil.getTransformedExcludeOperation(sOperation),
					sResultOperation,
					"Operation " + sOperation + " should be transformed to " + sResultOperation
				);
			});
		});

		QUnit.test("Operations which should not be transformed", function (assert) {
			// Arrange
			var aOperations = ["NE", "NB", "NotContains", "NotStartsWith", "NotEndsWith"];
			assert.expect(5);

			// Assert
			aOperations.forEach(function (sOperation) {
				assert.strictEqual(
					FilterUtil.getTransformedExcludeOperation(sOperation),
					sOperation,
					"Operation " + sOperation + " should not be transformed"
				);
			});
		});

		QUnit.start();

	});
})();
