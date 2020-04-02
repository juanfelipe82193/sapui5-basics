/**
 * tests for the sap.suite.ui.generic.template.designtime.ObjectPageDynamicHeaderTitle.designtime.js
 */
sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/designtime/ObjectPageDynamicHeaderTitle.designtime",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils"
	],
	function(sinon, ObjectPageDynamicHeaderTitle, DesigntimeUtils, ChangeHandlerUtils) {
		"use strict";

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
			this.getDesigntime = ObjectPageDynamicHeaderTitle.getDesigntime(oElement);
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
