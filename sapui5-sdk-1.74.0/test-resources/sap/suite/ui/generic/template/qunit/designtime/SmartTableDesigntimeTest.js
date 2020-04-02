/**
 * tests for the sap.suite.ui.generic.template.designtime.utils.SmartTable.designtime.js
 */
sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/designtime/SmartTable.designtime"
	],
	function(sinon, DesigntimeUtils, SmartTable) {
		"use strict";

		/********************************************************************************/
		QUnit.module("The function getSmartTableProperties", {
			beforeEach: function() {
				this.allProperties = {
					firstProperty: {ignore: true}
				};
				this.oIgnoreAllPropertiesStub = sinon.stub(DesigntimeUtils, "ignoreAllProperties").returns(this.allProperties);
			},
			afterEach: function() {
				this.oIgnoreAllPropertiesStub.restore();
			}
		});

		QUnit.test("getSmartTableProperties", function() {
			// Arrange
			var oElement = {};

			// Act
			var oProperties =  SmartTable.getSmartTableProperties(oElement);

			// Assert
			var oExpected = {
				firstProperty: {ignore: true},
				useExportToExcel: {ignore: false},
				enableAutoBinding: {ignore: false}
			};
			assert.deepEqual(oProperties, oExpected, "Properties are active as expected");
		});
	});
