/**
 * tests for the sap.suite.ui.generic.template.lib.ViewDependencyController
 */

sap.ui.define([ "testUtils/sinonEnhanced", "sap/suite/ui/generic/template/lib/ViewDependencyHelper", "sap/suite/ui/generic/template/js/AnnotationHelper", "sap/suite/ui/generic/template/lib/testableHelper"],
		function(sinon, ViewDependencyHelper, AnnotationHelper, testableHelper) {
	"use strict";

	var oViewDependencyHelper;

	var mComponentRegistry = {

	};

	var oTemplateContract = {
		componentRegistry : mComponentRegistry
	};

	module("lib.ViewDependencyHelper.setAllPagesDirty()", {
		setup : function() {
			oViewDependencyHelper = new ViewDependencyHelper(oTemplateContract);
		},
		teardown : function() {
			for (var sId in mComponentRegistry) delete mComponentRegistry[sId];
		}
	});

	QUnit.test("Test with empty registry", function(assert) {
		oViewDependencyHelper.setAllPagesDirty();
		assert.ok(true, "Run without error");
	});

	QUnit.test("Test with 1 entry in registry", function(assert) {
		var oComponent = {
				setIsRefreshRequired : Function.prototype
		};
		mComponentRegistry.test = {
				oComponent : oComponent
		};

		var oRefreshRequiredSpy = sinon.spy(oComponent, "setIsRefreshRequired");

		oViewDependencyHelper.setAllPagesDirty();

		assert.ok(oRefreshRequiredSpy.calledOnce, "RefreshRequired was called");
		assert.ok(oRefreshRequiredSpy.calledWithExactly(true), "RefreshRequired with correct parameters");
	});

	QUnit.test("Test with 10 entries in registry", function(assert) {
		var oComponent = {
				setIsRefreshRequired : Function.prototype
		};

		var test = {};

		for (var i = 0; i < 10; i++) {
			mComponentRegistry[i] = {
					oComponent : oComponent
			};
		}

		var oRefreshRequiredSpy = sinon.spy(oComponent, "setIsRefreshRequired");
		oViewDependencyHelper.setAllPagesDirty();

		assert.ok(oRefreshRequiredSpy.callCount === 10, "RefreshRequired was called 10 times");
		assert.ok(oRefreshRequiredSpy.calledWithExactly(true), "RefreshRequired with correct parameters");
	});

	QUnit.test("Test with 10 entries in registry, 3 in exclude list", function(assert) {
		var oComponent = {
				setIsRefreshRequired : Function.prototype
		};

		var test = {};

		for (var i = 0; i < 10; i++) {
			mComponentRegistry[i] = {
					oComponent : oComponent
			};
		}

		var oRefreshRequiredSpy = sinon.spy(oComponent, "setIsRefreshRequired");

		oViewDependencyHelper.setAllPagesDirty(["0","1","5"]);

		assert.ok(oRefreshRequiredSpy.callCount === 7, "RefreshRequired was called 10 times");
		assert.ok(oRefreshRequiredSpy.calledWithExactly(true), "RefreshRequired with correct parameters");
	});

	var oComponentListReport, oComponentObjectPage1, oComponentObjectPage2;
	module("lib.ViewDependencyHelper.setParentToDirty()", {
		setup : function() {
			oViewDependencyHelper = new ViewDependencyHelper(oTemplateContract);
		oComponentListReport = {
			getId : function(){ return "ListReport"; }
		};

		oComponentObjectPage1 = {
			getId : function(){ return "ObjectPage1"; }
		};

		oComponentObjectPage2 = {
			getId : function(){ return "ObjectPage2"; },
		};

		mComponentRegistry.ObjectPage2 = {
			oComponent : oComponentObjectPage2,
			routeConfig : {
				viewLevel : 2,
				entitySet : "ObjectPage2",
				parentEntitySet : "ObjectPage1"
			}
		};
		mComponentRegistry.ListReport = {
			oComponent : oComponentListReport,
			routeConfig : {
				viewLevel : 0,
				entitySet : "root",
				parentEntitySet : ""
			}
		};
		mComponentRegistry.ObjectPage1 = {
			oComponent : oComponentObjectPage1,
			routeConfig : {
				viewLevel : 1,
				entitySet : "ObjectPage1",
				parentEntitySet : "root"
			}
		};



		},
		teardown : function() {
			for (var sId in mComponentRegistry) delete mComponentRegistry[sId];
		}
	});

	QUnit.test("Test setParentToDirty", function(assert) {

		var oRefreshRequiredParentSpy = sinon.spy(oComponentObjectPage1, "setIsRefreshRequired");
		var oRefreshRequiredSelfSpy = sinon.spy(oComponentObjectPage2, "setIsRefreshRequired");

		var sNavigationProperty = "";
		oViewDependencyHelper.setParentToDirty(oComponentObjectPage2, sNavigationProperty);

		assert.ok(oRefreshRequiredParentSpy.calledOnce, "RefreshRequired on parent was called");
		assert.ok(oRefreshRequiredParentSpy.calledWithExactly(true), "RefreshRequired on parent with correct parameters");
		assert.ok(oRefreshRequiredSelfSpy.notCalled, "RefreshRequired is not called on myself");
	});

	QUnit.test("Set all ancestors to dirty", function(assert) {


		var oRefreshRequiredParentSpy1 = sinon.spy(oComponentObjectPage1, "setIsRefreshRequired");
		var oRefreshRequiredParentSpy2 = sinon.spy(oComponentListReport, "setIsRefreshRequired");
		var oRefreshRequiredSelfSpy = sinon.spy(oComponentObjectPage2, "setIsRefreshRequired");

		var sNavigationProperty = "";
		oViewDependencyHelper.setParentToDirty(oComponentObjectPage2, sNavigationProperty, null);

		assert.ok(oRefreshRequiredParentSpy1.calledOnce, "RefreshRequired on parent1 was called");
		assert.ok(oRefreshRequiredParentSpy2.calledOnce, "RefreshRequired on parent2 was called");
		assert.ok(oRefreshRequiredParentSpy1.calledWithExactly(true), "RefreshRequired on parent1 with correct parameters");
		assert.ok(oRefreshRequiredParentSpy2.calledWithExactly(true), "RefreshRequired on parent2 with correct parameters");
		assert.ok(oRefreshRequiredSelfSpy.notCalled, "RefreshRequired is not called on myself");
	});

	QUnit.test("Set only the immediate parent to dirty", function(assert) {


		var oRefreshRequiredParentSpy1 = sinon.spy(oComponentObjectPage1, "setIsRefreshRequired");
		var oRefreshRequiredParentSpy2 = sinon.spy(oComponentListReport, "setIsRefreshRequired");
		var oRefreshRequiredSelfSpy = sinon.spy(oComponentObjectPage2, "setIsRefreshRequired");

		var sNavigationProperty = "";
		oViewDependencyHelper.setParentToDirty(oComponentObjectPage2, sNavigationProperty, 1);

		assert.ok(oRefreshRequiredParentSpy1.calledOnce, "RefreshRequired on parent1 was called");
		assert.ok(oRefreshRequiredParentSpy2.notCalled, "RefreshRequired on parent2 was not called");
		assert.ok(oRefreshRequiredSelfSpy.notCalled, "RefreshRequired is not called on self");
		assert.ok(oRefreshRequiredParentSpy1.calledWithExactly(true), "RefreshRequired with correct parameters");
	});

	var oTestStub;

	module("lib.ViewDependencyHelper.setMeToDirty()", {
		setup : function() {
			oTestStub = testableHelper.startTest();
			oViewDependencyHelper = new ViewDependencyHelper(oTemplateContract);
		},
		teardown : function() {
			for (var sId in mComponentRegistry) delete mComponentRegistry[sId];
			testableHelper.endTest();
		}
	});

	QUnit.test("Test setMeToDirty with 1 entry in registry", function(assert) {
		var oComponent = {
			getID : function () {
				return "test";
			},
			getComponentContainer : function() {
				return {
					getSettings : function () {
						return {
							routeConfig : {
								viewLevel : 0
							}
						};
					}
				};
			}
		};

		mComponentRegistry.test = {
				oComponent : oComponent
		};

		var oRefreshRequiredSpy = sinon.spy(oComponent, "setIsRefreshRequired");
		var oSetParentToDirtyStub = sinon.stub(oTestStub, "setParentToDirty");

		var sNavigationProperty = "";
		oViewDependencyHelper.setMeToDirty(oComponent, sNavigationProperty);

		assert.ok(oRefreshRequiredSpy.calledOnce, "RefreshRequired was called");
		assert.ok(oRefreshRequiredSpy.calledWithExactly(true), "RefreshRequired with correct parameters");

		assert.ok(oSetParentToDirtyStub.notCalled, "setParentToDirty was not called");
	});

	module("lib.ViewDependencyHelper.unbindChildren()", {
		setup : function() {
			oViewDependencyHelper = new ViewDependencyHelper(oTemplateContract);
		},
		teardown : function() {
			for (var sId in mComponentRegistry) delete mComponentRegistry[sId];
		}
	});

	QUnit.test("Test unbindChildren", function(assert) {
		var oContainerListReport = { };

		oComponentListReport = {
			getId : function(){
				return "ListReport";
			}
		};

		var oContainerObjectPage1 = { };

		oComponentObjectPage1 = {
			getId : function(){
				return "ObjectPage1";
			}
		};

		var oContainerObjectPage2 = { };

		oComponentObjectPage2 = {
			getId : function(){
				return "ObjectPage2";
			}
		};

		var oContainerObjectPage3 = { };

		var oComponentObjectPage3 = {
			getId : function(){
				return "ObjectPage3";
			}
		};

		var oUnbindElementSpyObjectPage2 = sinon.spy();
		mComponentRegistry.ObjectPage2 = {
			oComponent : oComponentObjectPage2,
			routeConfig : {
				viewLevel : 2,
				entitySet : "ObjectPage2",
				parentEntitySet : "ObjectPage1"
			},
			utils: {
				unbind: oUnbindElementSpyObjectPage2
			}
		};
		var oUnbindElementSpyListReport = sinon.spy();
		mComponentRegistry.ListReport = {
			oComponent : oComponentListReport,
			routeConfig : {
				viewLevel : 0,
				entitySet : "root",
				parentEntitySet : ""
			},
			utils: {
				unbind: oUnbindElementSpyListReport
			}
		};
		var oUnbindElementSpyObjectPage1 = sinon.spy();
		mComponentRegistry.ObjectPage1 = {
			oComponent : oComponentObjectPage1,
			routeConfig : {
				viewLevel : 1,
				entitySet : "ObjectPage1",
				parentEntitySet : "root"
			},
			utils: {
				unbind: oUnbindElementSpyObjectPage1
			}
		};
		var oUnbindElementSpyObjectPage3 = sinon.spy();
		mComponentRegistry.ObjectPage3 = {
			oComponent : oComponentObjectPage3,
			routeConfig : {
				viewLevel : 3,
				entitySet : "ObjectPage3",
				parentEntitySet : "ObjectPage4"
			},
			utils: {
				unbind: oUnbindElementSpyObjectPage3
			}
		};

		oViewDependencyHelper.unbindChildren(oComponentListReport);

		assert.ok(oUnbindElementSpyObjectPage1.calledOnce, "unbindElement for ObjectPage1 was called");
		assert.ok(oUnbindElementSpyObjectPage2.calledOnce, "unbindElement for ObjectPage2 was called");
		assert.ok(oUnbindElementSpyObjectPage3.neverCalledWith, "unbindElement for ObjectPage3 was never called");
		assert.ok(oUnbindElementSpyListReport.neverCalledWith, "unbindElement for ListReport was never called");
	});
});
