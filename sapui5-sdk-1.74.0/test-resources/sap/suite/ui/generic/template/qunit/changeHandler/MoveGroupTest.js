/**
 * tests for the sap.suite.ui.generic.template.changeHandler.MoveGroup
 */
sap.ui.define([
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/changeHandler/MoveGroup",
		"sap/suite/ui/generic/template/changeHandler/generic/MoveElements",
		"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
		"sap/base/util/extend"
	],
	function (Utils, MoveGroup, MoveElements, AnnotationChangeUtils, extend) {
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
			var oExpected = MoveGroup.applyChange(oChange, oControl, oPropertyBag);

			//Assert
			assert.ok(typeof(oExpected) === "undefined", "undefined object was returned.");
			assert.equal(oApplyChangeStub.calledWith(oChange, oSpecificChangeInfo, oPropertyBag), true, "The function completeChangeContent has been called with the correct parameters.");
			assert.equal(oApplyChangeStub.callCount, 1, "The function applyChange has been called exactly once.");

			// Cleanup
			oApplyChangeStub.restore();
		});

		QUnit.module("Function revertChange");

		QUnit.test("RevertChange", function (assert) {
			var fnRevertChange = MoveGroup.revertChange;
			assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for MoveGroup action");
		});

		QUnit.module("Function completeChangeContent");

		QUnit.test("Calls MoveElements.completeChangeContent function", function (assert) {
			//Arrange
			var iIndex = 999,
				oCompleteChangeContentStub = sinon.stub(MoveElements, "completeChangeContent"),
				oGetIndexFromInstanceMetadataPath = sinon.stub(Utils, "getIndexFromInstanceMetadataPath").returns(iIndex),
				oChange = {},
				oPropertyBag = extend({}, {
					modifier: {
						bySelector: function () {
							return {};
						}
					},
					appComponent: function () {
						return {};
					}
				}),
				oGetExistingAnnotations = sinon.stub(AnnotationChangeUtils, "getExistingAnnotationsOfEntityType"),
				oGetSmartFormGroupInfo = sinon.stub(Utils, "getSmartFormGroupInfo").returns([]);

				var oSpecificChangeInfo = extend({}, {
					movedElements: [{id: "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::FormGroup"}]
				});

			//Act
			MoveGroup.completeChangeContent(oChange, oSpecificChangeInfo, oPropertyBag);

			//Assert
			assert.equal(oGetExistingAnnotations.callCount, 1, "function getExistingAnnotationsOfEntityType was exactly called once");
			assert.equal(oGetSmartFormGroupInfo.callCount, 1, "function getExistingAnnotationsOfEntityType was exactly called once");
			assert.equal(oCompleteChangeContentStub.calledWith(oChange, oSpecificChangeInfo, oPropertyBag), true, "The function completeChangeContent has been called with the correct parameters.");

			oSpecificChangeInfo = extend(oSpecificChangeInfo, {
				movedElements: [{id: "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--com.sap.vocabularies.UI.v1.Test::GeneralInformation::FormGroup"}]
			});
			MoveGroup.completeChangeContent(oChange, oSpecificChangeInfo, oPropertyBag);

			//Assert
			assert.equal(oCompleteChangeContentStub.calledWith(oChange, oSpecificChangeInfo, oPropertyBag), true, "The function completeChangeContent has been called with the correct parameters.");
			// Cleanup
			oCompleteChangeContentStub.restore();
			oGetIndexFromInstanceMetadataPath.restore();
			oGetExistingAnnotations.restore();
			oGetSmartFormGroupInfo.restore();
		});
	})
