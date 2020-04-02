sap.ui.define([
		'sap/ui/test/Opa5',
		"sap/ui/test/matchers/AggregationFilled",
		"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/utils/OpaDataStore",
		"sap/ui/test/actions/Press"
	],
	function (Opa5, AggregationFilled, OpaDataStore, Press) {
		"use strict";

		return Opa5.extend("sap.suite.ui.generic.template.opa.SalesOrderMultiEntitySets.pages.Common", {
			iStartTheListReport: function (oOptions) {
				var opaFrame = "test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttasalesordermultientity&sap-ui-language=en_US";
				if (oOptions) {
					opaFrame = opaFrame + "&manifest=" + oOptions; //&manifest=manifestWithFCL
				}
				console.log("OPA5::Common.js::iStartTheListReport" + " opaFrame: " + opaFrame);
				return this.iStartMyAppInAFrame(opaFrame);
			},

			iStartTheObjectPage: function (oOptions) {
				var opaFrame = "test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&sap-ui-language=en_US&demoApp=sttasalesordermultientity#/C_STTA_SalesOrder_WD_20('.1~0500000000.2~0000000080')"
				console.log("OPA5::Common.js::iStartTheObjectPage" + " opaFrame: " + opaFrame);
				return this.iStartMyAppInAFrame(opaFrame);
			},

			iTeardownMyApp: function () {
				console.log("OPA5::Common.js::iTeardownMyApp");
				return this.iTeardownMyAppFrame();
			},

			// click an item in the SmartTable - will navigate to Object Page
			iClickTheItemInAnyTable: function (iIndex, tab, sPrefix, sViewName, sViewNamespace) {
				return this.waitFor({
					id: tab ? sPrefix + "responsiveTable-" + tab : sPrefix + "responsiveTable",
					viewName: sViewName,
					viewNamespace: sViewNamespace,
					matchers: [
						new AggregationFilled({
							name: "items"
						})
					],
					actions: function (oControl) {
						var oItem = oControl.getItems()[iIndex];
						OpaDataStore.setData("tableItems", oControl.getItems());

						// store item data from List Report to Object page
						OpaDataStore.setData("navContextPath", oItem.getBindingContext().getPath());
						OpaDataStore.setData("selectedItem", oItem);

						oControl.fireItemPress({
							listItem: oItem
						});
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			}
		});
	}
);
