/**
 * tests for the sap.suite.ui.generic.template.ListReport.controller.IappStateHandler.js
 */
sap.ui.define([ "testUtils/sinonEnhanced",
                 "sap/suite/ui/generic/template/lib/testableHelper",
                 "sap/suite/ui/generic/template/ListReport/controller/IappStateHandler",
                 "sap/ui/generic/app/navigation/service/SelectionVariant",
				 "sap/ui/generic/app/navigation/service/NavigationHandler",
				 "sap/base/util/extend",
				 "sap/base/util/isEmptyObject"
                 ], function(sinon, testableHelper, IappStateHandler, SelectionVariant, navigationHandler, extend, isEmptyObject){
	"use strict";

	var bSmartVariantManagement = false;
	var bEnableAutoBinding = false;
	var bExecuteOnSelect = false;
	var bSuppressSelection;
	var fnDialogClosed;
	var oState = {
		oSmartFilterbar: {
			attachFiltersDialogClosed: function(fnHandler){
				if (fnDialogClosed){
					throw new Error("Only one handler must be registered");
				}
				if (!fnHandler){
					throw new Error("A handler must be registered");
				}
				fnDialogClosed = fnHandler;
			},
			setSuppressSelection: function(bSuppress){
				bSuppressSelection = bSuppress;
			},
			isCurrentVariantExecuteOnSelectEnabled: function(){
				return bExecuteOnSelect;
			},
			determineMandatoryFilterItems: function(){
				var aMandatoryFilterItem = [{
					getName: function(){
						return "P_DisplayCurrency";
					}
				}]
				return aMandatoryFilterItem;
			},
			getUiState: function(){
				return {
					getSelectionVariant: function() {
						var oSFBSelectionVariant = new SelectionVariant();
						return oSFBSelectionVariant;
					}
				}
			},
			setUiState: function(){
				return;
			},
			fireFilterChange: Function.prototype
		},
		oSmartTable: {
			getEnableAutoBinding: function(){
				return bEnableAutoBinding;
			}
		},
		oWorklistData: {
			bWorklistEnabled: false
		},
		oMultipleViewsHandler: {
			getEnableAutoBinding: function(){
				return false;
			},
			getMode: Function.prototype
		},
		oMultipleViewsHandler: {
			setControlVariant: Function.prototype,
			getEnableAutoBinding: function(){
				return false;
			},
			handleStartUpObject: Function.prototype,
			getSelectedKeyPropertyName: Function.prototype
		}
	};
	var oEditStateFilter = {};
	var oComponent = {
		getSmartVariantManagement: function(){
			return bSmartVariantManagement;
		},
		getEntitySet: Function.prototype,
		getModel: function(){
			return {
				getMetaModel: function(){
					return {
						getODataEntitySet: function(){
							return {
								entityType: ""
							}
						},
						getODataEntityType: function(){
							return {
								property: []
							}
						}
					};
				},
				setProperty: Function.prototype
			};
		}
	};

	var oController = {
		getOwnerComponent: function(){
			return oComponent;
		},
		byId: function(sId){
			if (sId === "editStateFilter"){
				return oEditStateFilter;
			}
			throw new Error("Only EditStateFilter must be looked up");
		},
		restoreCustomAppStateDataExtension: Function.prototype,
		modifyStartupExtension: Function.prototype
	};
	var bParseUrlFails = false;
	var oAppData, oAppDataLib, oURLParameters, sNavType;
	var oNavigationHandler = {
		parseNavigation: function(){
			return {
				done: function(fnDone){
					if (bParseUrlFails){
						return;
					}
					fnDone(oAppData, oURLParameters, sNavType);
				},
				fail: function(fnFail){
					if (bParseUrlFails){
						fnFail();
					}
				}
			};
		}
	};

	var oTemplateUtils = {
		oCommonUtils : {
			getNavigationHandler: function () {
				return oNavigationHandler;
			}
		},
		oComponentUtils : {
			getTemplatePrivateModel: function () {
				return {
					setProperty: Function.prototype
				}
			}
		}
	}

	var sandbox;
	var oStubForPrivate;
	var oIappStateHandler;

	module("Initialization", {
		setup : function() {
			oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		},
		teardown : function() {
			bSmartVariantManagement = false;
		}
	});

	test("Constructor", function(assert) {
		assert.ok(!!oIappStateHandler, "Constructor could be called");
		assert.ok(bSuppressSelection, "Selection must be supressed initially");
	});

	test("Complete initialization", function(assert) {
		assert.ok(!fnDialogClosed, "Do not register handler too early");
		oIappStateHandler.onSmartFilterBarInitialise();
		assert.strictEqual(typeof fnDialogClosed, "function", "A function must be registered as handler");
	});

	module("Parse url", {
		setup : function() {
			fnDialogClosed = null;
			bParseUrlFails = false;
			bEnableAutoBinding = false;
			bExecuteOnSelect = false;
		},
		teardown : function() {
			bSmartVariantManagement = false;
		}
	});

	test("parse Navigation fails", function(assert) {
		oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		oIappStateHandler.onSmartFilterBarInitialise();
		var done = assert.async();
		bParseUrlFails = true;
		var oNavigationPromise = oIappStateHandler.parseUrlAndApplyAppState();
		oNavigationPromise.catch(function(){
			assert.ok(true, "Failure is called correctly");
			done();
		});
	});

	test("parse Navigation success no auto select", function(assert) {
		oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		oIappStateHandler.onSmartFilterBarInitialise();
		var done = assert.async();
		oAppData = {};
		var oNavigationPromise = oIappStateHandler.parseUrlAndApplyAppState();
		sNavType = sap.ui.generic.app.navigation.service.NavType.initial;
		oNavigationPromise.then(function(){
			assert.ok(true, "Success is called correctly");
			done();
		});
	});

	test("parse Navigation success with auto select", function(assert) {
		var done = assert.async();
		oAppData = {};
		bEnableAutoBinding = true;
		oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		oIappStateHandler.onSmartFilterBarInitialise();
		var oSearchSpy = sinon.spy(oState.oSmartFilterbar, "search");
		var oNavigationPromise = oIappStateHandler.parseUrlAndApplyAppState();
		sNavType = sap.ui.generic.app.navigation.service.NavType.initial;
		oNavigationPromise.then(function(){
			assert.ok(oSearchSpy.calledOnce, "Search must have been triggered");
			oSearchSpy.restore();
			done();
		});
	});

	module("Parse URL: set Filterbar", {
		setup: function(){
			oStubForPrivate = testableHelper.startTest();
			oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
			sandbox = sinon.sandbox.create();
		},
		teardown : function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	function configurableTest(assert, oIAppState, oNavigationParameterURL, oNavigationParameterXAppState, oUserDefaultVariant, oUserDefaultValues, oBackendDefaultValues){
		/*
		 * currently there are 6 different known sources for filter values in SFB on startup of the app, some with different
		 * flavors:
		 * - iAppState: Any kind of back navigation or restoring a app to an older state by navigating to the URL
		 * 		stored at that time
		 * - navigationParameters: parameters given in any (forward) cross app navigation. There are two
		 * 		flavors:
		 * 		a) URLParameters: parameters given directly in the URL
		 * 		b) xAppState: navigation parameters encapsulated by an xAppState
		 * - userDefaultVariant: Parameters stored in a variant that the user marked as default. This
		 * 		information is stored in LREP
		 * 		=> As although delivered standard variants are using the same mechanism, the
		 * 				current assumption is, that they are handled the same way
		 * - userDefaultValues: In FLP (with some special preconditions) the user can set values for specific parameters
		 * 		that should be used for all apps
		 * - backendStandardVariant (not yet supported): A standard variant defined via annotations in the backend
		 * - backendDefaultValues: Default values for single properties defined via annotations in the backend
		 *
		 * Some of these support only single values, while others support full-fledged select options.
		 * If several of these sources contain values, the SFB should be filled according to the decision tree blow.
		 * "|" means property wise or, with priority from left to right (i.e. take the value for each property from the
		 * first place where it's specified)
		 *
		 * iAppState given?
		 * -> yes: use only the values from iAppstate
		 * -> no: navigationParameters given?
		 * 				-> yes: userDefaultVariant given?
		 * 								-> yes: use navigationParameters | userDefaultVariant
		 * 								-> no: use navigationParameters | userDefaultValues | backendStandardVariant | backendDefaultValues
		 * 				-> no: userDefaultVariant given?
		 * 								-> yes: use userDefaultVariant
		 * 								-> no: use userDefaultValues | backendStandardVariant | backendDefaultValues
		 */

//		preparation
//		data needed to provide in stubs
		var oSFBSelectionVariant = new SelectionVariant();
//		data set in stubs
		var aSFBAdvancedArea = [];
		var sSFBUiStateSelectionVariant;
		var oSFBUiStateProperties;
//		data to be checked
		var aSFBAdvancedAreaExpected = [];
//		needed stubs
		sandbox.stub(oState.oSmartFilterbar, "addFieldToAdvancedArea", function(sField){
			aSFBAdvancedArea.push(sField);
		});
//      variable to check if DisplayCurrency is there and value is comming from flp
		var flpValueforDisplayCurrency = false;
		sandbox.stub(oState.oSmartFilterbar, "clearVariantSelection");
		sandbox.stub(oState.oSmartFilterbar, "clear");
		sandbox.stub(oState.oSmartFilterbar, "getUiState", function(){
			return {
				getSelectionVariant : function(){
					return oSFBSelectionVariant
				}
			}
		});
		sandbox.stub(oState.oSmartFilterbar, "setUiState", function(oUiState, mProperties){
			sSFBUiStateSelectionVariant = oUiState.getSelectionVariant();
			oSFBUiStateProperties = mProperties;
		});
		sandbox.stub(oState.oSmartFilterbar, "isCurrentVariantStandard", function(){
			return true;
		});
		sandbox.stub(oState.oSmartFilterbar, "isCurrentVariantExecuteOnSelectEnabled", function(){
			return false;
		});

		var oSearchSpy = sandbox.spy(oState.oSmartFilterbar, "search");
		var iExpectedSearchCount = 0; // default

//		default values, if none of the sources contains values
		oAppData = {
				oDefaultedSelectionVariant: new SelectionVariant(),
				oSelectionVariant: new SelectionVariant()
		};
		oURLParameters = {};
		sNavType = sap.ui.generic.app.navigation.service.NavType.initial;
//		checks: methods from SFB should only be called if needed:
		var bSFBaddFieldToAdvancedAreaCalled = false;
		var bSFBsetUiStateCalled = false;
		// since modifyStartup extension is called, UI state is always retreived
		var bSFBgetUiStateCalled = true;
		var bSFBisCurrentVariantStandardCalled = false;
		var bSFBisCurrentVariantExecuteOnSelectEnabledCalled = false;


//		default values provided in the different sources are reflect differently:
//		userDefaultVariant: not provided in interface, but already applied to SFB
		for( var sProp in oUserDefaultVariant){
			oSFBSelectionVariant.addSelectOption(sProp, "I", "EQ", oUserDefaultVariant[sProp]);
			bSFBisCurrentVariantExecuteOnSelectEnabledCalled = true;
		}

//		backendDefaultValues: not provided in interface, but already applied to SFB, but only if no userDefaultVariant exists
		if (!oUserDefaultVariant || isEmptyObject(oUserDefaultVariant)){}
		for( var sProp in oBackendDefaultValues){
			oSFBSelectionVariant.addSelectOption(sProp, "I", "EQ", oBackendDefaultValues[sProp]);
			bSFBisCurrentVariantExecuteOnSelectEnabledCalled = true;
		}

//		iAppstate
		if (oIAppState && !isEmptyObject(oIAppState)){
			sNavType = sap.ui.generic.app.navigation.service.NavType.iAppState;
			for( var sProp in oIAppState){
				oAppData.oSelectionVariant.addSelectOption(sProp, "I", "EQ", oIAppState[sProp]);
				aSFBAdvancedAreaExpected.push(sProp);
			}
			bSFBaddFieldToAdvancedAreaCalled = true;
			bSFBsetUiStateCalled = true;
		}

//		navigationParameters: a) directly in URL
		if (oNavigationParameterURL && !isEmptyObject(oNavigationParameterURL)){
			sNavType = sap.ui.generic.app.navigation.service.NavType.URLParams;
			oURLParameters = oNavigationParameterURL;
			for( var sProp in oNavigationParameterURL){
				oAppData.oSelectionVariant.addSelectOption(sProp, "I", "EQ", oNavigationParameterURL[sProp]);
				aSFBAdvancedAreaExpected.push(sProp);
			}
			bSFBaddFieldToAdvancedAreaCalled = true;
			bSFBsetUiStateCalled = true;
			bSFBisCurrentVariantExecuteOnSelectEnabledCalled = false;
			iExpectedSearchCount = 1;
		}

//		navigationParamsters b) in xAppState
		if (oNavigationParameterXAppState && !isEmptyObject(oNavigationParameterXAppState)){
			sNavType = sap.ui.generic.app.navigation.service.NavType.xAppState;
			for( var sProp in oNavigationParameterXAppState){
				oAppData.oSelectionVariant.addSelectOption(sProp, "I", "EQ", oNavigationParameterXAppState[sProp]);
				aSFBAdvancedAreaExpected.push(sProp);
			}
			bSFBaddFieldToAdvancedAreaCalled = true;
			bSFBsetUiStateCalled = true;
			bSFBisCurrentVariantExecuteOnSelectEnabledCalled = false;
			iExpectedSearchCount = 1;
		}

//		userDefaultValues
		if (oUserDefaultValues && !isEmptyObject(oUserDefaultValues)){
			sNavType = sap.ui.generic.app.navigation.service.NavType.xAppState;
			for( var sProp in oUserDefaultValues){
				if(sProp != "DisplayCurrency"){
					oAppData.oSelectionVariant.addSelectOption(sProp, "I", "EQ", oUserDefaultValues[sProp]);
				}
				else {
					oAppData.oDefaultedSelectionVariant.addSelectOption(sProp, "I", "EQ", oUserDefaultValues[sProp]);
				}
				aSFBAdvancedAreaExpected.push(sProp);
			}
			oAppData.bNavSelVarHasDefaultsOnly = true;
			bSFBisCurrentVariantStandardCalled = true;
			bSFBaddFieldToAdvancedAreaCalled = true;
			bSFBsetUiStateCalled = true;
			bSFBisCurrentVariantExecuteOnSelectEnabledCalled = true;
			flpValueforDisplayCurrency = true;
		}

//		finalize interface
		oAppData.selectionVariant = oAppData.oSelectionVariant.toJSONString();


		/*********************************************************************************************************************
		 * execution * ***********
		 */
		var done = assert.async();
		var oNavigationPromise = oIappStateHandler.parseUrlAndApplyAppState();
		oAppDataLib = oAppData;
//		checks
		oNavigationPromise.then(function(){
//			no unneeded calls to SFB
			if(!flpValueforDisplayCurrency){
				assert.equal(oState.oSmartFilterbar.addFieldToAdvancedArea.called, bSFBaddFieldToAdvancedAreaCalled, "addFieldToAdvancedArea called");
			}
			assert.equal(oState.oSmartFilterbar.setUiState.called, bSFBsetUiStateCalled, "setUiState called");
			assert.equal(oState.oSmartFilterbar.getUiState.called, bSFBgetUiStateCalled, "getUiState called");
			assert.equal(oState.oSmartFilterbar.isCurrentVariantStandard.called, bSFBisCurrentVariantStandardCalled, "isCurrentVariantStandard called");
			assert.equal(oState.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled.called, bSFBisCurrentVariantExecuteOnSelectEnabledCalled, "isCurrentVariantExecuteOnSelectEnabled called");
			assert.equal(oSearchSpy.callCount, iExpectedSearchCount, "Search must have been triggered exactly " + iExpectedSearchCount + " times");

			if(bSFBsetUiStateCalled){
//				build expected result according to described decision tree, but without the parts that are preset by SFB (as the
//				mixing is not done by us but by the SFB)
//				check is only possible, when set by us (not handled by SFB itself)
//				if we would need to handle everything, the expected values would look like this:
//				var oExpectedValues =
//					oIAppState ||
//					((oNavigationParameterURL || oNavigationParameterXAppState) ?
//							(oUserDefaultVariant ? extend({}, oUserDefaultVariant, oNavigationParameterURL, oNavigationParameterXAppState) :
//								extend({}, oBackendDefaultValues, oUserDefaultValues, oNavigationParameterURL, oNavigationParameterXAppState)) :
//								(oUserDefaultVariant ? oUserDefaultVariant : extend({}, oBackendDefaultValues, oUserDefaultValues)) );
				var oExpectedValues =
					oIAppState ||
					((oNavigationParameterURL || oNavigationParameterXAppState) ?
							(oUserDefaultVariant ? extend({}, oNavigationParameterURL, oNavigationParameterXAppState) :
								extend({}, oUserDefaultValues, oNavigationParameterURL, oNavigationParameterXAppState)) :
									(oUserDefaultVariant ? oUserDefaultVariant : oUserDefaultValues) );
				var oSelectionVariant = new SelectionVariant();
				for( var sProp in oExpectedValues){
					if(sProp == "DisplayCurrency"){
					oSelectionVariant.addParameter("P_DisplayCurrency",oExpectedValues[sProp]);
					}
					else {
						oSelectionVariant.addSelectOption(sProp, "I", "EQ", oExpectedValues[sProp]);
					}
				}
				var bReplaceable;
				// Even when user default values are available, if these are modified through the modifyStartupextension
				// in all cases except when navType is iappState, then these default values are replaced by modified values
				if (!oUserDefaultValues || sNavType !== sap.ui.generic.app.navigation.service.NavType.iAppState){
					bReplaceable=true;
				} else {
					bReplaceable=false;
				}


				assert.ok(oState.oSmartFilterbar.setUiState.calledOnce, "setUiState called exactly once");
				assert.deepEqual(sSFBUiStateSelectionVariant, oSelectionVariant.toJSONObject(), "selectionVariant correctly set")

				assert.deepEqual(oSFBUiStateProperties,{
					replace: bReplaceable,
					strictMode: false
				}, "correct filter values set");

			}

			if(oState.oSmartFilterbar.addFieldToAdvancedArea.called){
				if(!flpValueforDisplayCurrency){
					assert.deepEqual(aSFBAdvancedArea, aSFBAdvancedAreaExpected, "correct fields added to advanced area");
				}
			}

			done();
		},function(){
			assert.ok(false, "parseUrlAndApplyAppState failed");
			done();
		});
	}

// simple tests - only one source used
	test("app startup with iAppState", function(assert){
		configurableTest(assert, {a: "1", b: "2"});
	});

	test("cross app navigation with URL parameters", function(assert){
		configurableTest(assert, null, {a: "1", b: "2"});
	});

	test("cross app navigation with x-app-state", function(assert){
		configurableTest(assert, null, null, {a: "1", b: "2"});
	});

	test("app startup with a user default variant", function(assert){
		configurableTest(assert, null, null, null, {a: "1", b: "2"});
	});

	test("app startup with a user default parameters", function(assert){
		configurableTest(assert, null, null, null, null, {a: "1", b: "2"});
	});

	test("app startup with a user default parameters for DisplayCurrency", function(assert){
		configurableTest(assert, null, null, null, null, {DisplayCurrency: "Eur"});
	});

	test("app startup with a backenddefault parameters", function(assert){
		configurableTest(assert, null, null, null, null, null, {a: "1", b: "2"});
	});


// combined sources
	test("backenddefault and user default parameters", function(assert){
		configurableTest(assert, null, null, null, null, {a: "1"}, {b: "2"});
	});

});
