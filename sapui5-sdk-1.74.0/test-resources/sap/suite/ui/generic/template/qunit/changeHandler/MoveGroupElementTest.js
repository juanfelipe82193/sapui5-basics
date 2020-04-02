/**
 * tests for the sap.suite.ui.generic.template.changeHandler.MoveGroupElement
 */
sap.ui.define([
		"sap/suite/ui/generic/template/changeHandler/MoveGroupElement",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/changeHandler/generic/MoveElements",
		"sap/base/util/extend"
	],
	function (MoveGroupElement, Utils, MoveElements, extend) {
		"use strict";

		QUnit.module("Function applyChange");

		QUnit.test("Calls MoveElements.applyChange", function (assert) {
			//Arrange
			var oApplyChangeStub = sinon.stub(MoveElements, "applyChange"),
				oSpecificChangeInfo = {},
				movedElements = {movedElements: "test"},
				oControl = {},
				oPropertyBag = {},
				oChange = {
					getContent: function () {
						return movedElements;
					}
				};

			//Act
			var oExpected = MoveGroupElement.applyChange(oChange, oControl, oPropertyBag);

			//Assert
			assert.ok(typeof(oExpected) === "undefined", "undefined object was returned.");
			assert.equal(oApplyChangeStub.calledWith(oChange, oSpecificChangeInfo, oPropertyBag), true, "The function completeChangeContent has been called with the correct parameters.");
			assert.equal(oApplyChangeStub.callCount, 1, "The function applyChange has been called exactly once.");

			// Cleanup
			oApplyChangeStub.restore();
		});

		QUnit.module("Function revertChange");

		QUnit.test("RevertChange", function (assert) {
			var fnRevertChange = MoveGroupElement.revertChange;
			assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for MoveGroupElement action");
		});

		QUnit.module("Function completeChangeContent");

		QUnit.test("Calls MoveElements.completeChangeContent function", function (assert) {
			//Arrange
			var iIndex = 999,
				oCompleteChangeContentStub = sinon.stub(MoveElements, "completeChangeContent"),
				oUtilsGetMetaModel = sinon.stub(Utils, "getMetaModel").returns(
					{
						getODataEntityType: function () {
							return {"com.sap.vocabularies.UI.v1.FieldGroup#TechnicalData": "test"};
						}
					}
				),
				oUtilsGetTemplatingInfo = sinon.stub(Utils, "getTemplatingInfo").returns(
					{
						value: "@com.sap.vocabularies.UI.v1.FieldGroup#TechnicalData",
					}
				),
				oGetIndexFromInstanceMetadataPath = sinon.stub(Utils, "getIndexFromInstanceMetadataPath").returns(iIndex),
				oChange = {},
				oPropertyBag = extend({}, {
					modifier: {
						bySelector: function () {

						}
					},
					appComponent: {}
				}),
				oSpecificChangeInfo = extend({}, {
					custom: {
						annotation: "com.sap.vocabularies.UI.v1.Facets",
						fnGetAnnotationIndex: iIndex
					},
					source: {
						id: {}
					}
				});


			//Act
			MoveGroupElement.completeChangeContent(oChange, oSpecificChangeInfo, oPropertyBag);

			//Assert
			assert.equal(oCompleteChangeContentStub.calledWith(oChange, oSpecificChangeInfo, oPropertyBag), true, "The function completeChangeContent has been called with the correct parameters.");

			// Cleanup
			oCompleteChangeContentStub.restore();
			oGetIndexFromInstanceMetadataPath.restore();
			oUtilsGetMetaModel.restore();
			oUtilsGetTemplatingInfo.restore();
		});
	})
