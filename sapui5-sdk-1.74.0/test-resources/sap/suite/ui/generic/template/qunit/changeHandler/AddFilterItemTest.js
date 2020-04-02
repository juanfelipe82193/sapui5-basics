/**
 * tests for the sap.suite.ui.generic.template.changeHandler.AddFilterItem
 */
sap.ui.define([
		"sap/suite/ui/generic/template/changeHandler/AddFilterItem",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/changeHandler/generic/AddElement"
	],
	function (AddFilterItem, Utils, AddElement) {
		"use strict";

		QUnit.module("AddFilterItem revertChange Test Module");

		QUnit.test("RevertChange", function (assert) {
			var fnRevertChange = AddFilterItem.revertChange;
			assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for AddFilterItem action");
		});

		QUnit.module("Function completeChangeContent");

		QUnit.test("Calls AddFilterItem.completeChangeContent", function (assert) {
			//Arrange
			var oCompleteChangeContentStub = sinon.stub(AddElement, "completeChangeContent"),
				getMetaModelStub = sinon.stub(Utils, "getMetaModel").returns({
					getODataEntityType: function (sEntityType) {
						return {
							"com.sap.vocabularies.UI.v1.SelectionFields": [{
								PropertyPath: "ProductEdit"
							}]
						};
					}
				}),
				getEntityTypeStub = sinon.stub(Utils, "getEntityType").returns({}),
				oSpecificChangeInfo = {
					selector: {
						id: "elementId"
					},
					addElementInfo: {
						name: "Product"
					}
				},
				mPropertyBag = {
					modifier: {
						bySelector: function (elementId, appComponent) {
							return {};
						}
					}
				},
				oChange = {};

			//Act
			var oExpected = AddFilterItem.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);

			//Assert
			assert.ok(typeof (oExpected) === "undefined", "undefined object was returned.");
			assert.equal(oCompleteChangeContentStub.callCount, 1, "The function completeChangeContent has been called exactly once.");

			// Cleanup
			oCompleteChangeContentStub.restore();
		});
	});