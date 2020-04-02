/*global QUnit,sinon*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/suite/ui/commons/demo/tutorial/controller/ProcessFlow.controller",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(jQuery, ProcessFlowController) {
	"use strict";

	QUnit.module("ProcessFlow Controller - getValuesDelta formatter", {
		beforeEach: function() {
			this.oController = new ProcessFlowController();
		},
		afterEach: function() {
			this.oController.destroy();
		}
	});

	QUnit.test("should return the delta with measure", function(assert) {
		var sResult = this.oController.getValuesDelta(5, 3, "%");
		assert.equal(sResult, "-2", "Correct string returned");
	});

	QUnit.module("ProcessFlow Controller - onNodePressed event handler", {
		beforeEach: function() {
			function getResourceBundle() {
				return jQuery.sap.resources({ url: "../../i18n/i18n.properties" });
			}

			this.oController = new ProcessFlowController();
			this.oController.getOwnerComponent = function() {
				return {
					getModel: function() {
						return {
							getResourceBundle: getResourceBundle
						};
					}
				};
			};
			this.oEventMock = {
				getParameters: function() {
					return {
						getTitle: function () {
							return "Title";
						}
					};
				}
			};
		},
		afterEach: function() {
			this.oController.destroy();
		}
	});

	QUnit.test("Node title should be part of the message toast text", function(assert) {
		var oSpy = sinon.spy(sap.m.MessageToast, "show");
		this.oController.onNodePressed(this.oEventMock);
		assert.ok(oSpy.calledWith("The node \"Title\" is clicked"), "MessageToast shown with correct text");
		oSpy.restore();
	});
});
