/**
 * tests for the sap.suite.ui.generic.template.lib.FlexibleColumnLayoutHandler
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/ui/base/Object",
	"sap/m/routing/Router",
	"sap/suite/ui/generic/template/lib/routingHelper",
	"sap/suite/ui/generic/template/lib/NavigationController",
	"sap/suite/ui/generic/template/lib/FlexibleColumnLayoutHandler",
	"sap/f/FlexibleColumnLayoutSemanticHelper"
], function (sinon, BaseObject, Router, routingHelper, NavigationController, FlexibleColumnLayoutHandler, FlexibleColumnLayoutSemanticHelper) {
	"use strict";

	var oSandbox;

	var oBeginColumnComponent = {};
	var oMidColumnComponent = {};
	var oEndColumnComponent = {};
	var oFCLSettings = Object.freeze({});
	var oSemanticHelper = {
		getDefaultLayouts: function () {
			return {
				defaultLayoutType: "OneColumn",
				defaultTwoColumnLayoutType: "TwoColumnsMidExpanded",
				defaultThreeColumnLayoutType: "ThreeColumnsMidExpanded"
			};
		}
	};

	var oTemplateContract = {
		oAppComponent: {
			getFlexibleColumnLayout: function(){
				return oFCLSettings;
			}
		},
		oTemplatePrivateGlobalModel: {
			setProperty: Function.prototype
		},
		oNavContainer: {
			to: Function.prototype
		},
		mRouteToTemplateComponentPromise: {
			root: {
				then: function (fnThen) {
					fnThen(oBeginColumnComponent);
				}
			},
			entitySetName1: {
				then: function (fnThen) {
					fnThen(oMidColumnComponent);
				}
			},
			entitySetName2: {
				then: function (fnThen) {
					fnThen(oEndColumnComponent);
				}
			}
		}
	};

	var oFlexibleColumnLayout, oRouter, oNavigationControllerProxy, oGetInstanceForStub;

	module("sap.suite.ui.generic.template.lib.FlexibleColumnLayoutHandler", {
		setup: function () {
			oSandbox = sinon.sandbox.create();
			oFlexibleColumnLayout = {
				setFullScreenColumn: Function.prototype,
				attachStateChange: Function.prototype
			};
			oRouter = sinon.createStubInstance(Router);
			oNavigationControllerProxy = {
				oRouter: oRouter,
				oTemplateContract: oTemplateContract
			};
			// oActivationInfo = {};
			oGetInstanceForStub = oSandbox.stub(FlexibleColumnLayoutSemanticHelper, "getInstanceFor", function () {
				return oSemanticHelper;
			});
			this.FlexibleColumnLayoutHandler = new FlexibleColumnLayoutHandler(oFlexibleColumnLayout, oNavigationControllerProxy);
		},
		teardown: function () {
			oSandbox.restore();
		}
	});

	test("Shall be instantiable", function (assert) {
		assert.ok(this.FlexibleColumnLayoutHandler, "Instantiation successfull");
	});

	test("get Methods", function (assert) {
		assert.ok(oGetInstanceForStub.calledOnce, "SemanticHelper must have been retrieved");
		assert.ok(oGetInstanceForStub.calledWithExactly(oFlexibleColumnLayout, oFCLSettings), "SemanticHelper must have been called with right parameters");
	});

	test("adaptRoutingInfo viewLevel = 0", function (assert) {
		var oRoute = {};
		var sTargetName = "root";
		var aPredecessorTargets = [];

		var sPagesAggregation = this.FlexibleColumnLayoutHandler.adaptRoutingInfo(oRoute, sTargetName, aPredecessorTargets, {
			fCLLevel: 0
		});

		assert.equal(sPagesAggregation, "beginColumnPages");
	});

	test("adaptRoutingInfo viewLevel = 1", function (assert) {
		var oRoute = {};
		var sTargetName = "C_STTA_SalesOrder_WD_20";
		var aPredecessorTargets = ["root"];

		var sPagesAggregation = this.FlexibleColumnLayoutHandler.adaptRoutingInfo(oRoute, sTargetName, aPredecessorTargets, {
			fCLLevel: 1
		});

		assert.equal(sPagesAggregation, "midColumnPages");
	});

	test("adaptRoutingInfo viewLevel = 2", function (assert) {
		var oRoute = {};
		var sTargetName = "C_STTA_SalesOrder_WD_20/to_Item";
		var aPredecessorTargets = ["root", "C_STTA_SalesOrder_WD_20"];

		var sPagesAggregation = this.FlexibleColumnLayoutHandler.adaptRoutingInfo(oRoute, sTargetName, aPredecessorTargets, {
			fCLLevel: 2
		});

		assert.equal(sPagesAggregation, "endColumnPages");
	});

	test("createMessagePageTargets", function (assert) {
		var fnCreateAdditionalMessageTarget = sinon.spy();
		this.FlexibleColumnLayoutHandler.createMessagePageTargets(fnCreateAdditionalMessageTarget);

		assert.ok(fnCreateAdditionalMessageTarget.called, "SemanticHelper must have been retrieved");
	});

	test("createMessagePageTargets", function (assert) {
		//var fnCreateAdditionalMessageTarget = function(){};
		var fnCreateAdditionalMessageTarget = sinon.spy();
		this.FlexibleColumnLayoutHandler.createMessagePageTargets(fnCreateAdditionalMessageTarget);

		assert.ok(fnCreateAdditionalMessageTarget.called, "SemanticHelper must have been retrieved");
	});
});
