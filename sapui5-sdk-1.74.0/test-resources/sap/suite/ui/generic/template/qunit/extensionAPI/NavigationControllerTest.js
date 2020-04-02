/**
 * tests for the sap.suite.ui.generic.template.extensionAPI.NavigationController
 */

sap.ui.define(["testUtils/sinonEnhanced",
                "sap/ui/core/UIComponent",
                "sap/ui/model/json/JSONModel",
                "sap/suite/ui/generic/template/extensionAPI/NavigationController",
                "sap/suite/ui/generic/template/extensionAPI/extensionAPI",

                "sap/suite/ui/generic/template/lib/testableHelper",
                "sap/suite/ui/generic/template/lib/MessageUtils",
                "sap/suite/ui/generic/template/lib/CRUDHelper",
                "sap/suite/ui/generic/template/lib/CRUDManager"
], function(sinon,
						UIComponent,
						JSONModel,
						NavigationController,
						extensionAPI,
						testableHelper,
						MessageUtils,
						CRUDHelper,
						CRUDManager) {
	"use strict";


	var oSandbox;
	var oExtensionAPI = {};
	var oController = {}, oComponentUtils, oCommonUtils, oBusyHelper, oCRUDManager;
	var oServices = {
			oDraftController: {},
			oApplication: { setEditableNDC: Function.prototype }
		};
		var sandbox, oStubForPrivate;
//
	function fnGeneralStartup(){
	    	oSandbox = sinon.sandbox.create();
	    	oCRUDManager = new CRUDManager(oController, oComponentUtils, oServices, oCommonUtils, oBusyHelper);
	}

	function fnGeneralTeardown(){
		oSandbox.restore();
		testableHelper.endTest();
	}

		module("extensionAPI.NavigationController", {
	    setup: fnGeneralStartup,
	    teardown: fnGeneralTeardown
	});

		test("Dummy", function() {
			ok(true, "dummy test - Always Good!");
		});

//
//	test("Test navigateExternal", function(assert) {
//
//		var oNavigationController = new sap.suite.ui.generic.template.extensionAPI.NavigationController();
//
//		oNavigationController.navigateExternal("EPMProductManageSt");
//
//	});
});
