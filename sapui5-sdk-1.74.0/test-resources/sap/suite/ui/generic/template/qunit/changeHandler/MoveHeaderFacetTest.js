/**
 * tests for the sap.suite.ui.generic.template.changeHandler.MoveHeaderFacet
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/MoveHeaderFacet",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/generic/MoveElements",
	"sap/base/util/extend"
],
function(
		MoveHeaderFacet,
		Utils,
		MoveElements,
		extend
	) {
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
		var oExpected = MoveHeaderFacet.applyChange(oChange, oControl, oPropertyBag);

		//Assert
		assert.ok(typeof(oExpected) === "undefined", "undefined object was returned.");
		assert.equal(oApplyChangeStub.calledWith(oChange, oSpecificChangeInfo, oPropertyBag), true, "The function completeChangeContent has been called with the correct parameters.");
		assert.equal(oApplyChangeStub.callCount, 1, "The function applyChange has been called exactly once.");

		// Cleanup
		oApplyChangeStub.restore();
	});

	QUnit.module("Function revertChange");

	QUnit.test("RevertChange", function (assert) {
		var fnRevertChange = MoveHeaderFacet.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for MoveGroupElement action");
	});

	QUnit.module("Function completeChangeContent");

	QUnit.test("Calls MoveElements.completeChangeContent function", function (assert) {
		//Arrange
		var iIndex = 999,
			oCompleteChangeContentStub = sinon.stub(MoveElements, "completeChangeContent"),
			oGetIndexFromInstanceMetadataPath = sinon.stub(Utils, "getHeaderFacetIndex").returns(iIndex),
			oChange = {},
			oPropertyBag = {},
			oSpecificChangeInfo = extend({}, {
				custom: {
					annotation: "com.sap.vocabularies.UI.v1.Facets",
					fnGetAnnotationIndex: iIndex
				}
			});

		//Act
		MoveHeaderFacet.completeChangeContent(oChange, oSpecificChangeInfo, oPropertyBag);

		//Assert
		assert.equal(oCompleteChangeContentStub.calledWith(oChange, oSpecificChangeInfo, oPropertyBag), true, "The function completeChangeContent has been called with the correct parameters.");

		// Cleanup
		oCompleteChangeContentStub.restore();
		oGetIndexFromInstanceMetadataPath.restore();
	});
})
