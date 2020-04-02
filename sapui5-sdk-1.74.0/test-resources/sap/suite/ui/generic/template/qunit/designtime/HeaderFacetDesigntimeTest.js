/**
 * tests for the sap.suite.ui.generic.template.designtime.HeaderFacet.designtime.js
 */
sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/designtime/HeaderFacet.designtime"
	],
	function(sinon, DesigntimeUtils, HeaderFacet) {
		"use strict";

		QUnit.dump.maxDepth = 20;

		/********************************************************************************/
		QUnit.module("The function getHeaderFacetProperties", {
			beforeEach: function() {
				this.allProperties = {
					firstProperty: {ignore: true}
				};
				this.oIgnoreAllPropertiesStub = sinon.stub(DesigntimeUtils, "ignoreAllProperties").returns(this.allProperties);
				var oBundle = {
					getText: function() {
						return;
					}
				};
				this.oGetResourceBundleStub = sinon.stub(sap.ui.getCore().getModel("i18nDesigntime"), "getResourceBundle").returns(oBundle);

			},
			afterEach: function() {
				this.oIgnoreAllPropertiesStub.restore();
				this.oGetResourceBundleStub.restore();
			}
		});

		QUnit.test("getHeaderFacetProperties of non-chart type", function() {
			// Arrange
			var oElement = {};
			this.oGetFacetTypeStub = sinon.stub(HeaderFacet, "getFacetType").returns("Non-Chart");

			// Act
			var oProperties =  HeaderFacet.getHeaderFacetProperties(oElement);

			// Assert
			assert.deepEqual(oProperties.firstProperty, {ignore: true}, "Blacklisted property is ignored");
			assert.equal(oProperties.visible.ignore, false, "Property visible is active");
			assert.equal(oProperties.vMeasures.virtual, true, "Property vMeasures is present");
			assert.equal(oProperties.vMeasures.ignore(), true, "Property vMeasures is not active");
			assert.equal(oProperties.vMeasures.type, "Collection", "Property vMeasures has the right type");
			assert.equal(oProperties.vMeasures.multiple, true, "Property vMeasures is not multiple");

			this.oGetFacetTypeStub.restore();
		});

		QUnit.test("getHeaderFacetProperties of chart type", function() {
			// Arrange
			var oElement = {};
			this.oGetFacetTypeStub = sinon.stub(HeaderFacet, "getFacetType").returns("Chart");

			// Act
			var oProperties =  HeaderFacet.getHeaderFacetProperties(oElement);

			// Assert
			assert.deepEqual(oProperties.firstProperty, {ignore: true}, "Blacklisted property is ignored");
			assert.equal(oProperties.visible.ignore, false, "Property visible is active");
			assert.equal(oProperties.vMeasures.virtual, true, "Property vMeasures is present");
			assert.equal(oProperties.vMeasures.ignore(), false, "Property vMeasures is active");
			assert.equal(oProperties.vMeasures.type, "Collection", "Property vMeasures has the right type");
			assert.equal(oProperties.vMeasures.multiple, true, "Property vMeasures is not multiple");

			this.oGetFacetTypeStub.restore();
		});

	});
