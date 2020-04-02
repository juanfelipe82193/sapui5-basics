sap.ui.define(['sap/ui/test/Opa5',
               "sap/ui/test/matchers/AggregationFilled",
               "sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/utils/OpaDataStore",
               "sap/ui/test/actions/Press",
				"utils/Utils",
				"utils/mockserver/MockServerLauncher"
	],
	function(Opa5, AggregationFilled, OpaDataStore, Press, Utils, MockServerLauncher) {
		"use strict";
		var sUrl = "test-resources/sap/suite/ui/generic/template/demokit/flpSandbox.html?serverDelay=50&responderOn=true&sap-ui-language=en_US&sap-theme=sap_belize";

		return Opa5.extend("sap.suite.ui.generic.template.opa.SalesOrderNoExtensions.pages.Common", {

			iShouldSeeNoSupportAssistantErrors: function() {
				return this.waitFor({
					success: function() {
						Opa5.assert.noRuleFailures({
							failOnHighIssues: false,
							rules: [{
								libName: "sap.ui.core",
								ruleId: "libraryUsage"
							}],
							executionScope: {
								type: 'components',
								selectors: [
									"__component0"
								]
							}
						});
					}
				});
			},
			iShouldGetSupportRuleReport: function() {
				return this.waitFor({
					success: function() {
						Opa5.assert.getFinalReport();
					}
				});
			},

			iStartTheListReport: function(sManifest) {
				var sOpaFrame = "test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttasalesordernoext&sap-ui-language=en_US";
				if (sManifest) {
					sOpaFrame = sOpaFrame + "&manifest=" + sManifest; //&manifest=manifestFCL
				}
				console.log ( "OPA5::Common.js::iStartTheListReport" + " opaFrame: " + sOpaFrame);
				return this.iStartMyAppInAFrame(sOpaFrame);
			},

			iStartTheListReportIfNeeded: function(sManifest) {
				var oContext = sap.ui.test.Opa.getContext();

				if (oContext.bIsStarted) {
					console.log ("DEBUG: iStartTheListReport: already started");
					return this;
				}
				oContext.bIsStarted = true;
				return this.iStartTheListReport(sManifest);
			},

			iStartTheListReportWithChange: function(sManifest) {
				var sOpaFrame = "test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttasalesordernoext&sap-ui-language=en_US&withChange=true";
				if (sManifest) {
					sOpaFrame = sOpaFrame + "&manifest=" + sManifest; //&manifest=manifestFCL
				}
				console.log ( "OPA5::Common.js::iStartTheListReport" + " opaFrame: " + sOpaFrame);
				return this.iStartMyAppInAFrame(sOpaFrame);
			},
			iStartTheListReportInFlpSandboxWithChange: function(oOptions) {
				var flpApps = "&withChange=true&flpApps=STTASOWD20-STTASOWD20,EPMManageProduct-displayFactSheet,BusinessPartner-displayFactSheet";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#STTASOWD20-STTASOWD20");
			},
			
			iStartTheObjectPage: function(sManifest) {
				var sOpaFrame = "test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttasalesordernoext&sap-ui-language=en_US";
				if (sManifest) {
					sOpaFrame = sOpaFrame + "&manifest=" + sManifest; //&manifest=manifestFCL
				}
				sOpaFrame = sOpaFrame + "#//C_STTA_SalesOrder_WD_20(SalesOrder='500000000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)";
				return this.iStartMyAppInAFrame(sOpaFrame);
			},

			iStartTheObjectPageWithGermanLanguage: function(sManifest) {
				var sOpaFrame = "test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttasalesordernoext&sap-ui-language=DE";
				if (sManifest) {
					sOpaFrame = sOpaFrame + "&manifest=" + sManifest; //&manifest=manifestFCL
				}
				sOpaFrame = sOpaFrame + "#//C_STTA_SalesOrder_WD_20(SalesOrder='500000000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)";
				console.log ( "OPA5::Common.js::iStartTheObjectPage" + " opaFrame: " + sOpaFrame);
				return this.iStartMyAppInAFrame(sOpaFrame);
			},

			iTeardownMyApp: function() {
				console.log ( "OPA5::Common.js::iTeardownMyApp");
				OpaDataStore.clearData();
				return this.iTeardownMyAppFrame();
			},

			iTeardownMyAppIfNeeded: function() {
				var oContext = sap.ui.test.Opa.getContext();

				if (!oContext.bIsStarted) {
					console.warn("DEBUG: iStopTheListReport: not started!");
					return this;
				}
				oContext.bIsStarted = false;
				return this.iTeardownMyApp();
			},

			// click an item in the SmartTable - will navigate to Object Page
			iClickTheItemInAnyTable: function(iIndex, sPrefix, sViewName, sViewNamespace) {
				var sId = sPrefix + "responsiveTable";
				console.log ( "OPA5::Common.js::iClickTheItemInAnyTable" + " sId: " + sId + " iIndex: " + iIndex + " sPrefix: " + sPrefix + " sViewName: " + sViewName + " sViewNamespace: " + sViewNamespace);
				return this.waitFor({
					id: sId,
					//viewName: sViewName,
					//viewNamespace: sViewNamespace,
					matchers: [
						new AggregationFilled({
							name: "items"
						})
					],
					actions: function(oControl) {
						var oItem = oControl.getItems()[iIndex];
						OpaDataStore.setData("tableItems",  oControl.getItems());

						// store item data from List Report to Object page
						OpaDataStore.setData("navContextPath", oItem.getBindingContext().getPath());
						OpaDataStore.setData("selectedItem", oItem);

						oControl.fireItemPress({listItem:oItem});
					},
					errorMessage: "The Smart Table is not rendered correctly sID:" + sId
 				});
			},

		});
	}
);
