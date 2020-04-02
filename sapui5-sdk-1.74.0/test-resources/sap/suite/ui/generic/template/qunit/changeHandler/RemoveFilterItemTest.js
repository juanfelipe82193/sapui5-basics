/**
 * tests for the sap.suite.ui.generic.template.changeHandler.RemoveFilterItem
 */
sap.ui.define([
		"sap/suite/ui/generic/template/changeHandler/RemoveFilterItem",
		"sap/suite/ui/generic/template/changeHandler/generic/RemoveElement"
	],
	function (RemoveFilterItem, RemoveElement) {
		"use strict";

		QUnit.module("RemoveFilterItem revertChange Test Module");

		QUnit.test("RevertChange", function (assert) {
			var fnRevertChange = RemoveFilterItem.revertChange;
			assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for RemoveFilterItem action");
		});

		QUnit.module("Function applyChange");

		QUnit.test("Calls RemoveFilterItem.applyChange", function (assert) {
			//Arrange
			var oChange = {
				getContent: function () {
					return {
						customChanges: [{
							oSelector: "selector"
						}]
					}
				}
			};
			var mPropertyBag = {
				modifier: {
					bySelector: function (oSelector) {
						return {
							getParent: function () {
								return {
									destroy: function () {

									}
								}
							}
						}
					}
				}
			};
			var oControl = {};

			//Act
			var oExpected = RemoveFilterItem.applyChange(oChange, oControl, mPropertyBag);

			//Assert
			assert.ok(typeof (oExpected) === "undefined", "undefined object was returned.");

			// Cleanup
		});

		QUnit.module("Function completeChangeContent");

		QUnit.test("Calls RemoveFilterItem.completeChangeContent", function (assert) {
			//Arrange
			var oCompleteChangeContentStub = sinon.stub(RemoveElement, "completeChangeContent"),
				oSpecificChangeInfo = {},
				mPropertyBag = {},
				oChange = {};

			//Act
			var oExpected = RemoveFilterItem.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);

			//Assert
			assert.ok(typeof (oExpected) === "undefined", "undefined object was returned.");
			assert.equal(oCompleteChangeContentStub.calledWith(oChange, oSpecificChangeInfo, mPropertyBag), true,
				"The function completeChangeContent has been called with the correct parameters.");
			assert.equal(oCompleteChangeContentStub.callCount, 1, "The function completeChangeContent has been called exactly once.");

			// Cleanup
			oCompleteChangeContentStub.restore();
		});
	})