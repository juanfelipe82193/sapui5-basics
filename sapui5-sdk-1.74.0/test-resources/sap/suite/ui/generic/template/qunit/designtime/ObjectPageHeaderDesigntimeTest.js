/**
 * tests for the sap.suite.ui.generic.template.designtime.ObjectPageHeader.designtime.js
 */
sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/designtime/ObjectPageHeader.designtime",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils"
	],
	function(sinon, ObjectPageHeader, DesigntimeUtils, ChangeHandlerUtils) {
		"use strict";

		/********************************************************************************/
		QUnit.module("The function getObjectHeaderProperties", {
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

		QUnit.test("getObjectHeaderProperties", function() {
			// Arrange
			var oElement = {};

			// Act
			var oProperties =  ObjectPageHeader.getObjectHeaderProperties(oElement);

			// Assert
			var oExpected = {
				firstProperty: {ignore: true},
				objectImageShape: {ignore: false}
			};
			assert.deepEqual(oProperties, oExpected, "Properties are active as expected");
		});

		/********************************************************************************/
		QUnit.module("The function getCommonInstanceData");

		QUnit.test("getCommonInstanceData", function() {
			// Arrange
			this.oGetIndexStub = sinon.stub(ChangeHandlerUtils, "getTemplatingInfo").returns({
				target: "target",
				annotation: "com.sap.vocabularies.UI.v1.HeaderInfo"
			});
			var oElement =  {
				getModel: function() {
					return {
						getMetaModel: function() {
							return {};
						}
					};
				},
				getMetadata: function() {
					return {
						getElementName: function() {
							return "name"
						},
						getAllProperties: function() {
						}
					}
				}
			};
			this.getDesigntime = ObjectPageHeader.getDesigntime(oElement);

			// Act
			var oCommonInstanceData = this.getDesigntime.getCommonInstanceData(oElement);

			// Assert
			var oExpectedInstanceData = {
				annotation: "com.sap.vocabularies.UI.v1.HeaderInfo",
				target: "target/com.sap.vocabularies.UI.v1.HeaderInfo",
			};
			assert.deepEqual(oCommonInstanceData, oExpectedInstanceData , "returns correct data");

			this.oGetIndexStub.restore();
		});

	});
