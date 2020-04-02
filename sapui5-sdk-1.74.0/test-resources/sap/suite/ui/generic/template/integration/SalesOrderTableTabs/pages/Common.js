sap.ui.define(['sap/ui/test/Opa5',
               "sap/ui/test/matchers/AggregationFilled",
               "sap/suite/ui/generic/template/integration/SalesOrderTableTabs/utils/OpaDataStore",
               "sap/ui/test/actions/Press"],
	function(Opa5, AggregationFilled, OpaDataStore, Press) {
		"use strict";

		return Opa5.extend("sap.suite.ui.generic.template.opa.SalesOrderTableTabs.pages.Common", {
			
			iStartTheListReport: function(oOptions) {
				var opaFrame = "test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttasalesordertt&sap-ui-language=en_US";
				console.log ( "OPA5::Common.js::iStartTheListReport" + " opaFrame: " + opaFrame);
				return this.iStartMyAppInAFrame(opaFrame);
			},

			iStartTheObjectPage: function(oOptions) {
				var opaFrame = "test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&sap-ui-language=en_US&demoApp=sttasalesordertt#/C_STTA_SalesOrder_WD_20(SalesOrder='500000000',DraftUUID=guid'00505691-115b-1ee6-b7af-2c76b881888d',IsActiveEntity=false)"
				console.log ( "OPA5::Common.js::iStartTheObjectPage" + " opaFrame: " + opaFrame);
				return this.iStartMyAppInAFrame(opaFrame);
			},

			iTeardownMyApp: function() {
				console.log ( "OPA5::Common.js::iTeardownMyApp");
				OpaDataStore.clearData();
				return this.iTeardownMyAppFrame();
			},

			iLookAtTheScreen: function() {
				console.log ( "OPA5::Common.js::iLookAtTheScreen");
				return this;
			},
			
			iClickTheButtonWithId: function(sId, sButtonText) {
				console.log ( "OPA5::Common.js::iClickTheButtonWithId " + " sId: " + sId + " sButtonText: " + sButtonText); 
			 	return this.waitFor({
			 		id: sId,
			 		success: function (oButton) {
			 			oButton.firePress();
			 		},
			 		errorMessage: "The " + sButtonText + " button could not be found"
			 	});
			},

			// click an item in the SmartTable - will navigate to Object Page
			iClickTheItemInAnyTable: function(iIndex, sPrefix, sViewName, sViewNamespace) {
				var sId = sPrefix + "responsiveTable";
				console.log ( "OPA5::Common.js::iClickTheItemInAnyTable" + " sId: " + sId + " iIndex: " + iIndex + " sPrefix: " + sPrefix + " sViewName: " + sViewName + " sViewNamespace: " + sViewNamespace); 
				return this.waitFor({
					id: sId,
					viewName: sViewName,
					viewNamespace: sViewNamespace,
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

						oItem.firePress();
					},
					errorMessage: "The Smart Table is not rendered correctly sID:" + sId
 				});
			},
			
			
		});
	}
);
