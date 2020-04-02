/**
 * tests for the sap.suite.ui.generic.template.designtime.DynamicPage.designtime.js
 */
sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/designtime/DynamicPage.designtime"
	],
	function(sinon, DesigntimeUtils, DynamicPage) {
		"use strict";

		/********************************************************************************/
		QUnit.module("The function getControlProperties", {
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

		QUnit.test("getControlProperties", function() {
			// Arrange
			var oElement = {};

			// Act
			var oProperties =  DynamicPage.getControlProperties(oElement);

			// Assert
			var oExpected = {
				firstProperty: {ignore: true},
				fitContent: {
					ignore: false
				}
			};
			assert.deepEqual(oProperties, oExpected, "Properties are active as expected");
		});
	});
