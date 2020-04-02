/**
 * tests for the sap.suite.ui.generic.template.lib.AppComponent
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/ui/generic/app/ApplicationController", "sap/suite/ui/generic/template/lib/AppComponent", "sap/suite/ui/generic/template/lib/CRUDHelper", "sap/suite/ui/generic/template/lib/testableHelper",
"sap/suite/ui/generic/template/lib/AjaxHelper"],
	function(sinon, ApplicationController, AppComponent, CRUDHelper, testableHelper, AjaxHelper) {
	"use strict";

	var oModel = {
		oMetadata: {
			isLoaded: function(){
				return true;
			},
			isFailed: function(){
				return false;
			}
		},
		attachPropertyChange: function(){},
		canoncialRequestsEnabled: function(){
			return false;
		},
		messageScopeSupported: function(){
			return Promise.resolve(false);
		}
	};
	var oTemplatePrivateGlobal = {
		setProperty: function() {}
	};
	var oApplicationController = {
		attachEvent: function(){},
		attachBeforeQueueItemProcess: function(){},
		attachOnQueueCompleted: function(){},
		attachOnQueueFailed: function(){}
	};
	var oAppComponent;
	var oAppRegistryEntry;
	var oStaticStub;
	var oStubForPrivate;

	var oSandbox;

	function fnGeneralSetup(){
		oStubForPrivate = testableHelper.startTest();
		oStaticStub = testableHelper.getStaticStub();
		oSandbox = sinon.sandbox.create();
		oSandbox.stub(oStaticStub, "TemplateComponent_RegisterAppComponent", function(oRegistryEntry){
			oAppRegistryEntry = oRegistryEntry;
			return Function.prototype;
		});
		oSandbox.stub(oStaticStub, "NavigationController", function(){

		});

		oSandbox.stub(AppComponent.prototype, "getModel", function(sId){
			if(sId === "_templPrivGlobal") {
				return oTemplatePrivateGlobal;
			} else {
				return oModel;
			}
		});

		oSandbox.stub(AppComponent.prototype, "getManifestObject", function(){
			return {
				getEntry: function(){
					return {};
				}

			};
		});
		oSandbox.stub(CRUDHelper, "enableAutomaticDraftSaving", Function.prototype);
		testableHelper.observeConstructor(ApplicationController, function(oM){
			if (oM !== oModel){
				throw new Error("ApplicationController must be instantiated with the OData model");
			}
			return oApplicationController;
		}, true);
	}

	function fnGeneralTeardown(){
			oAppRegistryEntry = null;
			oSandbox.restore();
			testableHelper.endTest();
	}

	module("Test the setup of an instance", {
		setup: fnGeneralSetup,
		teardown: fnGeneralTeardown
	});

	QUnit.test("Test that the AppComponent is registered correctly", function(assert) {
		oAppComponent = new AppComponent();
		assert.ok(!!oAppComponent, "AppComponent was created");
		assert.strictEqual(oAppRegistryEntry.appComponent, oAppComponent, "AppComponent must have been registered");
	});

	QUnit.test("Test that createContent works correct in the 'real' scenario", function(assert) {
		oSandbox.stub(oAppComponent, "getId", function() {
			return "xyz::";
		});
		var oBusyHelper = {
			setBusyReason: sinon.spy(),
			setBusy: sinon.spy(),
			getUnbusy: function(){
				return {
					then: Function.prototype
				};
			}
		};
		oSandbox.stub(oStaticStub, "BusyHelper", function() {
			return oBusyHelper;
		});
		oAppComponent = new AppComponent();
		oAppRegistryEntry.oTemplateContract.oApplicationProxy = {
			onAfterNavigate: Function.prototype
		};
		var done = assert.async();
		setTimeout(function(){
			assert.ok(oBusyHelper.setBusyReason.calledOnce, "setBusyReason was called");
			var aFirstCallArgs = oBusyHelper.setBusyReason.args[0];
			assert.strictEqual(aFirstCallArgs[0], "HashChange", "busy reason was 'HashChange'");
			assert.ok(aFirstCallArgs[1], "Set busy");
			assert.ok(aFirstCallArgs[2], "Set busy immediately");
			done();
		});
	});


	module("Test features of the application descriptor", {
		setup: function() {
			fnGeneralSetup();

			//aSetupArgs[0] is the getMethods function of AppComponent.js
			oAppComponent = new AppComponent();
		},
		teardown: fnGeneralTeardown
	});

	//Variables needed for the tests
	var sManifestUrl110 = "test-resources/sap/suite/ui/generic/template/qunit/lib/testdata/manifest_v110.json",
		oManifest110 = AjaxHelper.syncGetJSON(sManifestUrl110).data,
		sManifestUrl130 = "test-resources/sap/suite/ui/generic/template/qunit/lib/testdata/manifest_v130.json",
		oManifest130 = AjaxHelper.syncGetJSON(sManifestUrl130).data,
		sManifestUrlMultipleViews = "test-resources/sap/suite/ui/generic/template/qunit/lib/testdata/manifest_multipleviews.json",
		oManifestMultipleViews = AjaxHelper.syncGetJSON(sManifestUrlMultipleViews).data,
		sManifestUrlMultipleViewsDifferentEntitySets = "test-resources/sap/suite/ui/generic/template/qunit/lib/testdata/manifest_multipleviews_differententitysets.json",
		oManifestMultipleViewsDifferentEntitySets = AjaxHelper.syncGetJSON(sManifestUrlMultipleViewsDifferentEntitySets).data;

	QUnit.test("Test getConfig transformation from app.descriptor 1.3.0 to 1.1.0 with getConfig", function(assert) {
		var oExpectedConfig = oManifest110["sap.ui.generic.app"],
			oConfig = null,
			getManifestEntry = function(sPath) {
				assert.strictEqual(sPath, "sap.ui.generic.app", "Only path 'sap.ui.generic.app' must be accessed through getManifestEntry");
				return oManifest130[sPath];
			};

		oSandbox.stub(oAppComponent, "getMetadata", function() {
			return {
				getManifestEntry: getManifestEntry
			};
		});
		oConfig = oManifest130["sap.ui.generic.app"];
		oStubForPrivate.fnNormalizePagesMapToArray(oConfig);
		//Fix version so it looks completely as 1.1.0 for the runtime
		oConfig._version = "1.1.0";
		assert.deepEqual(oConfig, oExpectedConfig,
			"App. descriptor namespace 'sap.ui.generic.app' version 1.3.0 must match version 1.1.0 when returned by getConfig");
	});

	QUnit.test("Test getConfig transformation from app.descriptor 1.3.0 to 1.1.0 with getInternalManifest", function(assert) {
		"use strict";

		var oConfig = {test: "some configuration"};

		oSandbox.stub(oStubForPrivate, "getConfig", function() {
			return oConfig;
		})

		var oInternalManifest = oAppComponent.getInternalManifest();

		assert.deepEqual(oInternalManifest["sap.ui.generic.app"], oConfig, "App. descriptor namespace 'sap.ui.generic.app' returns the same when using getInternalManifest as getConfig");
	});

	QUnit.test("Test getConfig for non-different entity sets (default)", function(assert) {
		// test that fnAddMissingEntitySetsToQuickVariantSelectionX does NOT add entitySet entries to the variant definitions
		var oConfig = oManifestMultipleViews["sap.ui.generic.app"];
		var getManifest = function() {
			return oManifestMultipleViews;
		};
		var getManifestEntry = function(sPath) {
			return oManifestMultipleViews[sPath];
		};
		oSandbox.stub(oAppComponent, "getMetadata", function() {
			return {
				getManifest: getManifest,
				getManifestEntry: getManifestEntry
			};
		});
		var oConfig = oAppComponent.getConfig();
		assert.strictEqual(oConfig.pages[0].component.settings.quickVariantSelectionX.variants["1"].entitySet, undefined, "for quickVariantSelectionX, no entitySet should have been added to variant 1");
		assert.strictEqual(oConfig.pages[0].component.settings.quickVariantSelectionX.variants["2"].entitySet, undefined, "for quickVariantSelectionX, no entitySet should have been added to variant 2");
	});

	QUnit.test("Test getConfig for different entity sets", function(assert) {
		// test that fnAddMissingEntitySetsToQuickVariantSelectionX adds entitySet entries to the variant definitions based on the leading entity set
		var oConfig = oManifestMultipleViewsDifferentEntitySets["sap.ui.generic.app"];
		var getManifest = function() {
			return oManifestMultipleViewsDifferentEntitySets;
		};
		var getManifestEntry = function(sPath) {
			return oManifestMultipleViewsDifferentEntitySets[sPath];
		};
		oSandbox.stub(oAppComponent, "getMetadata", function() {
			return {
				getManifest: getManifest,
				getManifestEntry: getManifestEntry
			};
		});
		var oConfig = oAppComponent.getConfig();
		assert.strictEqual(oConfig.pages[0].component.settings.quickVariantSelectionX.variants["1"].entitySet, "STTA_C_MP_Product", "for quickVariantSelectionX, entitySet of variant 1 should have been set to STTA_C_MP_Product");
		assert.strictEqual(oConfig.pages[0].component.settings.quickVariantSelectionX.variants["2"].entitySet, "SomeOtherEntitySet", "for quickVariantSelectionX, entitySet of variant 2 should not have been modified");
	});
});
