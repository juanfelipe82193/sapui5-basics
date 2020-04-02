/**
 * tests for the sap.suite.ui.generic.template.lib.NavigationController
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/m/NavContainer",
	"sap/ui/base/Object",
	"sap/ui/core/Control",
	"sap/ui/core/routing/HashChanger",
	"sap/ui/core/routing/Router",
	"sap/ui/core/routing/Views",
	"sap/ui/model/Filter",
	"sap/ui/model/odata/ODataMetaModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/generic/template/lib/AppComponent",
	"sap/suite/ui/generic/template/lib/NavigationController",
	"sap/suite/ui/generic/template/lib/testableHelper",
	"sap/suite/ui/generic/template/lib/routingHelper"
], function (sinon, NavContainer, BaseObject, Control, HashChanger, Router, Views, Filter, ODataMetaModel, ODataModel, JSONModel, AppComponent, NavigationController, testableHelper, routingHelper) {
	"use strict";

	var aSections = ["SalesOrder(1)"];
	var oConfig = {
		"pages": [{
			"entitySet": "I_AIS_E_SalesOrder_A",
			"component": {
				"name": "sap.suite.ui.generic.template.ListReport"
			}
		}]
	};
	var oTemplatePrivateModel;
	var oTemplateContract = {
		oApplicationProxy: {
			onAfterNavigate: Function.prototype,
			onBypassed: Function.prototype,
			onRouteMatched: Function.prototype,
			setEditableNDC: Function.prototype,
			getHierarchySectionsFromCurrentHash: function () {
				return aSections;
			}
		},
		oBusyHelper: {
			setBusy: Function.prototype,
			setBusyReason: Function.prototype
		},
		aStateChangers: [],
		componentRegistry: {
			component1: {
				utils: {
					getTemplatePrivateModel: function () {
						return oTemplatePrivateModel;
					},
					suspendBinding: Function.prototype
				},
				oControllerUtils: {
					oServices: {
						oTemplateCapabilities: {}
					}
				}
			}
		},
		mRouteToTemplateComponentPromise: {
			SalesOrderItem: Promise.reject()
		},
		oPagesDataLoadedObserver: {
			getProcessFinished: function () {
				return {
					then: Function.prototype
				};
			}
		},
		routeViewLevel1: {
			pattern: ""
		},
		oShellServicePromise: {
			then: function() {
				return new Promise(function(resolve, reject) {});
			}
		},
		oStatePreserversAvailablePromise: Promise.resolve()
	};
	var oAppComponent;
	var oHashChangerStub;
	var oSandbox;
	var oTargets = {
		addTarget: Function.prototype
	};
	var oTemplatePrivateGlobalModel;
	var oStubForPrivate;

	module("sap.suite.ui.generic.template.lib.NavigationController", {
		setup: function () {
			oStubForPrivate = testableHelper.startTest();
			oSandbox = sinon.sandbox.create();
			oHashChangerStub = {
				replaceHash: sinon.stub(),
				setHash: sinon.stub(),
				getHash: sinon.stub()
			};
			oSandbox.stub(HashChanger, "getInstance", function () {
				return oHashChangerStub;
			});
			oAppComponent = sinon.createStubInstance(AppComponent);
			oAppComponent.getManifestEntry.returns({});
			oAppComponent.getConfig = function () {
				return oConfig;
			};
			oTemplatePrivateGlobalModel = {
				bindProperty: function (sPath) {
					return {
						attachChange: function (fnHandleNavigationMenu) {}
					};
				}
			};
			oTemplatePrivateModel = new JSONModel();
			var oNavigationHost = sinon.createStubInstance(NavContainer);
			oTemplateContract.oAppComponent = oAppComponent;
			oTemplateContract.oNavigationHost = oNavigationHost;
			oTemplateContract.getText = Function.prototype;
			oTemplateContract.oTemplatePrivateGlobalModel = oTemplatePrivateGlobalModel;
			var oModel = sinon.createStubInstance(ODataModel);
			this.oMetaModel = {
				loaded: function () {
					return {
						then: function (fnThen) {}
					};
				}
			};
			oModel.getMetaModel.returns(this.oMetaModel);
			oAppComponent.getModel.returns(oModel);
			this.oRouter = sinon.createStubInstance(Router);
			this.oRouter.getTargets.returns(oTargets);
			oAppComponent.getRouter.returns(this.oRouter);
			this.oRouter._oViews = sinon.createStubInstance(Views);
			this.oNavigationController = new NavigationController(oTemplateContract);
			oTemplateContract.mEntityTree.SalesOrderItem = {
				sRouteName: "SalesOrderItem",
				level: 2,
				parent: "SalesOrder",
				parentRoute: "SalesOrder",
				contextPath: "SalesOrderItem({keys2})"
			};
			oTemplateContract.mEntityTree.SalesOrder = {
				sRouteName: "SalesOrder",
				level: 1,
				pattern: "",
				parentRoute: "root",
				contextPath: "SalesOrder"
			};
			oTemplateContract.mRoutingTree.SalesOrderItem = oTemplateContract.mEntityTree.SalesOrderItem;
			oTemplateContract.mRoutingTree.SalesOrder = oTemplateContract.mEntityTree.SalesOrder;
			oTemplateContract.mRoutingTree.root = {
				sRouteName: "root",
				level: 0
			};
			oTemplateContract.oTemplatePrivateGlobalModel = new JSONModel();
		},
		teardown: function () {
			this.oNavigationController.destroy();
			oSandbox.restore();
			testableHelper.endTest();
		}
	});

	test("Shall be instantiable", function (assert) {
		assert.ok(this.oNavigationController);
		assert.ok(!oHashChangerStub.setHash.called, "Instantiation should not set hash");
		assert.ok(!oHashChangerStub.replaceHash.called, "Instantiation should not replace hash");
	});

	test("navigateToContext shall call setHash on the HashChanger with path from Context", function (assert) {
		var sPath = "/SalesOrderItem(12345)";
		var oContext = {
			getPath: function () {
				return sPath;
			}
		};
		var done = assert.async();
		this.oNavigationController.navigateToContext(oContext);
		setTimeout(function () {
			assert.ok(!oHashChangerStub.replaceHash.called, "replaceHash must not have been called");
			assert.ok(oHashChangerStub.setHash.calledOnce, "setHash must have been called");
			assert.ok(oHashChangerStub.setHash.calledWith(sPath), "setHash must have been called with correct parameter");
			done();
		}, 0);
	});

	test("navigateToContext shall call setHash on the HashChanger with path from Context and navigationProperty", function (assert) {
		var sPath = "/SalesOrderItem(12345)";
		var sNavProperty = "toItem";
		oHashChangerStub.getHash.returns("SalesOrder(1)");
		var oContext = {
			getPath: function () {
				return sPath;
			}
		};
		var done = assert.async();
		this.oNavigationController.navigateToContext(oContext, sNavProperty);
		setTimeout(function () {
			assert.ok(!oHashChangerStub.replaceHash.called, "replaceHash must not have been called");
			assert.ok(oHashChangerStub.setHash.calledOnce, "setHash must have been called");
			assert.ok(oHashChangerStub.setHash.calledWith("/SalesOrder(1)/toItem(12345)"), "setHash must have been called with correct parameter");
			done();
		}, 0);
	});

	test("navigateToContext shall call setHash on the HashChanger with path from Context and navigationProperty, ignoring query params from current hash", function (assert) {
		var sPath = "/SalesOrderItem(12345)";
		var sNavProperty = "/toItem";
		oHashChangerStub.getHash.returns("SalesOrder(1)?somequeryparam=abcd");
		var oContext = {
			getPath: function () {
				return sPath;
			}
		};
		var done = assert.async();
		this.oNavigationController.navigateToContext(oContext, sNavProperty);
		setTimeout(function () {
			assert.ok(!oHashChangerStub.replaceHash.called, "replaceHash must not have been called");
			assert.ok(oHashChangerStub.setHash.calledOnce, "setHash must have been called");
			assert.ok(oHashChangerStub.setHash.calledWith("/SalesOrder(1)/toItem(12345)"), "setHash must have been called with correct parameter");
			done();
		}, 0);
	});

	test("navigateToContext shall call setHash on the HashChanger with path from Context and navigationProperty, ignoring query params and replacing navigationProperty path", function (assert) {
		var sPath = "/SalesOrderItem(12345)";
		var sNavProperty = "/toItem";
		oHashChangerStub.getHash.returns("/SalesOrder(1)/toItem(123)?somequeryparam=abcd");
		var oContext = {
			getPath: function () {
				return sPath;
			}
		};
		var done = assert.async();
		this.oNavigationController.navigateToContext(oContext, sNavProperty);
		setTimeout(function () {
			assert.ok(!oHashChangerStub.replaceHash.called, "replaceHash must not have been called");
			assert.ok(oHashChangerStub.setHash.calledOnce, "setHash must have been called");
			assert.ok(oHashChangerStub.setHash.calledWith("/SalesOrder(1)/toItem(12345)"), "setHash must have been called with correct parameter");
			done();
		}, 0);
	});

	test("navigateToContext shall call replaceHash on the HashChanger with path from Context and navigationProperty, when bReplace is passed", function (assert) {
		var sPath = "/SalesOrderItem(12345)";
		var sNavProperty = "toItem";
		oHashChangerStub.getHash.returns("SalesOrder(1)");
		var oContext = {
			getPath: function () {
				return sPath;
			}
		};
		var done = assert.async();
		this.oNavigationController.navigateToContext(oContext, sNavProperty, true);
		setTimeout(function () {
			assert.ok(!oHashChangerStub.setHash.calledOnce, "setHash must not have been called");
			assert.ok(oHashChangerStub.replaceHash.calledOnce, "replaceHash must have been called");
			assert.ok(oHashChangerStub.replaceHash.calledWith("/SalesOrder(1)/toItem(12345)"), "replaceHash must have been called with the correct parameter");
			done();
		}, 0);
	});

	test("navigateToRoot shall call navTo on the Router correctly", function (assert) {
		oStubForPrivate.setCurrentIdentity({
			treeNode: oTemplateContract.mEntityTree.SalesOrder,
			keys: ["", "123"],
			appStates: Object.create(null)
		});
		var done = assert.async();
		this.oNavigationController.navigateToRoot();
		setTimeout(function () {
			assert.ok(oAppComponent.getRouter().navTo.calledOnce, "navTo must have been called");
			assert.ok(oAppComponent.getRouter().navTo.calledWith("root", {}, false), "navTo must have been called with correct parameters");
			done();
		}, 0);
	});

	test("navigateToMessagePage shall navigate to the right target", function (assert) {
		oStubForPrivate.setCurrentIdentity({
			keys: [],
			appStates: Object.create(null)
		});
		var mParams = {
			title: "SomeTitle",
			text: "SomeText",
			icon: "SomeIcon",
			description: "SomeDescription"
		};

		oTemplateContract.oTemplatePrivateGlobalModel = {
			setProperty: sinon.stub()
		};
		var oDisplaySpy = oSandbox.spy(oTargets, "display");
		this.oNavigationController.navigateToMessagePage(mParams);
		assert.ok(oTemplateContract.oTemplatePrivateGlobalModel.setProperty.calledOnce, "Properties must have been set");
		var oArgs = oTemplateContract.oTemplatePrivateGlobalModel.setProperty.firstCall.args;
		assert.strictEqual(oArgs[0], "/generic/messagePage", "properties for message test must have been set");
		assert.deepEqual(oArgs[1], {
			text: "SomeText",
			icon: "SomeIcon",
			description: "SomeDescription"
		}, "correct properties must have been set");
		assert.ok(oDisplaySpy.calledOnce, "display must have been called");
		assert.ok(oDisplaySpy.calledWithExactly("messagePage"), "display must have been called with correct parameter");
		delete oTemplateContract.oTemplatePrivateGlobalModel;
	});

	test("navigateToMessagePage shall navigate to the right target and take icon from entitySet", function (assert) {
		oStubForPrivate.setCurrentIdentity({
			keys: [],
			appStates: Object.create(null)
		});
		var mParams = {
			entitySet: "SalesOrder",
			description: "SomeDescription",
			title: "SomeTitle",
			text: "SomeText",
			icon: "SomeIcon"
		};

		var oEntityType = {
			name: "SalesOrder",
			"com.sap.vocabularies.UI.v1.HeaderInfo": {
				"TypeImageUrl": {
					"String": "SomeIconFromEntity"
				}
			}
		};

		this.oMetaModel.getODataEntitySet = sinon.stub();
		this.oMetaModel.getODataEntitySet.returns({
			entityType: "SalesOrder"
		});
		this.oMetaModel.getODataEntityType = sinon.stub();
		this.oMetaModel.getODataEntityType.returns(oEntityType);


		oTemplateContract.oTemplatePrivateGlobalModel = {
			setProperty: sinon.stub()
		};
		var oDisplaySpy = oSandbox.spy(oTargets, "display");
		this.oNavigationController.navigateToMessagePage(mParams);
		assert.ok(oTemplateContract.oTemplatePrivateGlobalModel.setProperty.calledOnce, "Properties must have been set");
		var oArgs = oTemplateContract.oTemplatePrivateGlobalModel.setProperty.firstCall.args;
		assert.strictEqual(oArgs[0], "/generic/messagePage", "properties for message test must have been set");
		assert.deepEqual(oArgs[1], {
			text: "SomeText",
			description: "SomeDescription",
			icon: "SomeIconFromEntity"
		}, "correct properties must have been set");
		assert.ok(oDisplaySpy.calledOnce, "display must have been called");
		assert.ok(oDisplaySpy.calledWithExactly("messagePage"), "display must have been called with correct parameter");
		delete oTemplateContract.oTemplatePrivateGlobalModel;
	});

	function getComponent1() {
		var fnOnActivate = sinon.stub();
		fnOnActivate.returns(Promise.reject());
		return {
			getId: function () {
				return "component1";
			},
			onActivate: fnOnActivate
		};
	}

	test("routeMatched event of the router shall call activateComponent", function (assert) {

		var oComponent = getComponent1();
		oTemplateContract.mRouteToTemplateComponentPromise = {
			SalesOrderItem: {
				then: function (fnThen) {
					fnThen(oComponent);
				}
			}
		};
		oSandbox.stub(oTemplateContract.oApplicationProxy, "getAlternativeContextPromise", function () {
			return Promise.resolve();
		});
		var fRouteMatched = this.oRouter.attachRouteMatched.args[0][0];
		var fThis = this.oRouter.attachRouteMatched.args[0][1];
		var oEventParam = {
			getParameter: sinon.stub()
		};

		var oRouteConfig = {
			name: "SalesOrderItem",
			target: "theTarget",
			entitySet: "SalesOrderItem",
			viewLevel: 1,
			pattern: "",
			contextPath: ""
		};
		var oArgs = {};
		oEventParam.getParameter.withArgs("config").returns(oRouteConfig);
		oEventParam.getParameter.withArgs("arguments").returns(oArgs);
		var done = assert.async();
		oComponent.onActivate = function () {
			assert.ok(true, "Component activation must have been performed");
			done();
			return Promise.reject();
		};
		fRouteMatched.call(fThis, oEventParam);
	});

	test("routeMatched event of the router - test for 'root' operation", function () {
		var oComponent = getComponent1();
		oTemplateContract.mRouteToTemplateComponentPromise = {
			root: {
				then: function (fnThen) {
					fnThen(oComponent);
				}
			}
		};
		oSandbox.stub(oTemplateContract.oApplicationProxy, "getAlternativeContextPromise", function () {
			return Promise.resolve();
		});

		var fRouteMatched = this.oRouter.attachRouteMatched.args[0][0];
		var fThis = this.oRouter.attachRouteMatched.args[0][1];
		var oEventParam = {
			getParameter: sinon.stub()
		};
		var oRouteConfig = {
			name: "root",
			operation: "root",
			target: "root",
			viewLevel: 0
		};
		var oArgs = {};
		oEventParam.getParameter.withArgs("config").returns(oRouteConfig);
		oEventParam.getParameter.withArgs("arguments").returns(oArgs);
		var done = assert.async();
		oComponent.onActivate = function () {
			assert.ok(true, "Component activation must have been performed");
			done();
			return Promise.reject();
		};
		fRouteMatched.call(fThis, oEventParam);
	});

	test("routeMatched event of the router", function (assert) {
		var sBindingPath = "/SalesOrderItem(12345)";
		var sPattern = "SalesOrder({keys1})/toItem({keys2})";
		var sEntity = "SalesOrderItem";
		var sNavigationProp = "toItem";
		var oComponent = getComponent1();
		oTemplateContract.mRouteToTemplateComponentPromise = {
			SalesOrderItem: {
				then: function (fnThen) {
					fnThen(oComponent);
				}
			}
		};

		oSandbox.stub(oTemplateContract.oApplicationProxy, "getAlternativeContextPromise", function () {
			return Promise.resolve();
		});

		var fRouteMatched = this.oRouter.attachRouteMatched.args[0][0];
		var fThis = this.oRouter.attachRouteMatched.args[0][1];
		var oEventParam = {
			getParameter: sinon.stub()
		};
		var oRouteConfig = {
			name: sEntity,
			operation: "detail",
			pattern: sPattern,
			navigationProperty: sNavigationProp,
			entitySet: sEntity,
			target: "ttt",
			viewLevel: 2
		};
		var oArgs = {
			keys1: "123",
			keys2: "12345"
		};
		oEventParam.getParameter.withArgs("config").returns(oRouteConfig);
		oEventParam.getParameter.withArgs("arguments").returns(oArgs);
		var done = assert.async();
		oComponent.onActivate = function (sPath) {
			assert.strictEqual(sPath, sBindingPath, "Component activation must have been performed with correct parameter");
			done();
			return Promise.reject();
		};
		fRouteMatched.call(fThis, oEventParam);
	});
});
