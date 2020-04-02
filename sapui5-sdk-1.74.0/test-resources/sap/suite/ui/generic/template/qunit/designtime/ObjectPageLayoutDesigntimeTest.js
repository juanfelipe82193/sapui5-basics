/**
 * tests for the sap.suite.ui.generic.template.designtime.ObjectPageLayout.designtime.js
 */
sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/designtime/ObjectPageLayout.designtime",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils"
	],
	function(sinon, ObjectPageLayout, DesigntimeUtils) {
		"use strict";

		/********************************************************************************/
		QUnit.module("The function getHBoxProperties", {
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

		QUnit.test("getHBoxProperties", function() {
			// Arrange
			var oElement = {};

			// Act
			var oProperties =  ObjectPageLayout.getHBoxProperties(oElement);

			// Assert
			var oExpected = {
				firstProperty: {ignore: true},
				visible: {ignore: false}
			};
			assert.deepEqual(oProperties, oExpected, "Properties are active as expected");
		});
	});
