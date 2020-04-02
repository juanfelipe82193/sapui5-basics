/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/fl/FakeLrepConnectorLocalStorage",
	'test-resources/sap/ui/mdc/qunit/p13n/OpaTests/utility/Util'
], function(Opa5, FakeLrepConnectorLocalStorage, TestUtil) {
	"use strict";

	var Arrangement = Opa5.extend("sap.ui.mdc.qunit.p13n.test.Arrangement", {

		closeAllPopovers: function() {
			return this.waitFor({
				controlType: "sap.m.ResponsivePopover",
				success: function(aControls) {
					aControls.forEach(function(oControl) {
						oControl.close();
					});
					return this.waitFor({
						check: function() {
							return !Opa5.getPlugin().getMatchingControls({
								controlType: "sap.m.Popover",
								visible: true,
								interactable: true
							}).length;
						}
					});
				}
			});
		},
		enableAndDeleteLrepLocalStorage: function() {
			// Init LRep for VariantManagement (we have to fake the connection to LRep in order to be independent from backend)
			FakeLrepConnectorLocalStorage.enableFakeConnector();
			FakeLrepConnectorLocalStorage.forTesting.synchronous.clearAll();
		}
	// iClearTheLocalStorageFromRtaRestart: function() {
	// 	window.localStorage.removeItem("sap.ui.rta.restart.CUSTOMER");
	// 	window.localStorage.removeItem("sap.ui.rta.restart.USER");
	// }
	});

	Arrangement.P13nDialog = {
		Settings:{
			Icon: "sap-icon://action-settings",
			Back: "sap-icon://decline",
			MoveToTop: "sap-icon://collapse-group",
			MoveUp: "sap-icon://slim-arrow-up",
			MoveDown: "sap-icon://slim-arrow-down"
		},
		Sort:{
			Icon: "sap-icon://sort",
			Back: "sap-icon://decline",
			MoveToTop: "sap-icon://collapse-group",
			MoveUp: "sap-icon://slim-arrow-up",
			MoveDown: "sap-icon://slim-arrow-down"
		},
		Filter:{
			Icon: "sap-icon://filter",
			Back: "sap-icon://decline",
			MoveToTop: "sap-icon://collapse-group",
			MoveUp: "sap-icon://slim-arrow-up",
			MoveDown: "sap-icon://slim-arrow-down"
		},
		AdaptFilter:{
			MoveToTop: "sap-icon://collapse-group",
			MoveUp: "sap-icon://slim-arrow-up",
			MoveDown: "sap-icon://slim-arrow-down"
		},
		Titles:{
			sort: TestUtil.getTextFromResourceBundle("sap.ui.mdc", "sort.PERSONALIZATION_DIALOG_TITLE"),
			columns: TestUtil.getTextFromResourceBundle("sap.ui.mdc", "table.SETTINGS_COLUMN"),
			chart: TestUtil.getTextFromResourceBundle("sap.ui.mdc", "chart.PERSONALIZATION_DIALOG_TITLE"),
			filter: TestUtil.getTextFromResourceBundle("sap.ui.mdc", "filter.PERSONALIZATION_DIALOG_TITLE"),
			adaptFilter: TestUtil.getTextFromResourceBundle("sap.ui.mdc", "filterbar.ADAPT")
		}
	};

	return Arrangement;
}, true);
