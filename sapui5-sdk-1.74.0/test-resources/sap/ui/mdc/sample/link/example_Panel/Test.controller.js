sap.ui.define([
	'sap/ui/core/mvc/Controller', 'sap/ui/rta/RuntimeAuthoring', 'sap/ui/model/json/JSONModel'
], function(Controller, RuntimeAuthoring, JSONModel) {
	"use strict";

	var Test = Controller.extend("sap.ui.mdc.sample.link.example_Panel.Test", {

		onInit: function() {
			var oView = this.getView();
			var oPanel = oView.byId("IDInfoPanel");
			oPanel.setModel(new JSONModel({
				baseline: [
					{
						id: oView.createId("IDInfoPanelItem00"),
						visible: true
					}, {
						id: oView.createId("IDInfoPanelItem04"),
						visible: true
					}
				],
				metadata: [
					{
						id: oView.createId("IDInfoPanelItem00"),
						isMain: true,
						text: "Prolite B2791QSU-B1",
						description: "iiyama",
						href: "https://iiyama.com/",
						target: "_blank",
						icon: "/testsuite/test-resources/sap/ui/documentation/sdk/images/HT-1037.jpg"
					}, {
						id: oView.createId("IDInfoPanelItem01"),
						text: "Display Description",
						description: "Transaction code DD",
						href: "?testsuite_mdc_base_sample_action_example_Panel_Actions_01#link"
					}, {
						id: oView.createId("IDInfoPanelItem02"),
						text: "Review Description",
						description: "Transaction code DR",
						href: "?testsuite_mdc_base_sample_action_example_Panel_Actions_02#link",
						icon: "sap-icon://to-be-reviewed"
					}, {
						id: oView.createId("IDInfoPanelItem03"),
						text: "Edit Description",
						description: "Transaction code DE",
						href: "?testsuite_mdc_base_sample_action_example_Panel_Actions_03#link",
						icon: "sap-icon://user-edit"
					}, {
						id: oView.createId("IDInfoPanelItem04"),
						text: "Superior",
						description: "Transaction SHELL",
						href: "https://www.shell.de/",
						target: "_blank",
						icon: "sap-icon://mileage"
					}, {
						id: oView.createId("IDInfoPanelItem05"),
						text: "Edit Description (Additional)",
						href: "?testsuite_mdc_base_sample_action_example_Panel_AdditionalActions_01#link"
					// icon: "sap-icon://edit"
					}, {
						id: oView.createId("IDInfoPanelItem06"),
						text: "Review Description (Additional)",
						href: "?testsuite_mdc_base_sample_action_example_Panel_AdditionalActions_02#link",
						icon: "sap-icon://pixelate"
					}
				]
			}), "$sapuimdcbasesampleinfoexample_panel");
		},
		onPressRTA: function() {
			var oRuntimeAuthoring = new RuntimeAuthoring({
				rootControl: this.getOwnerComponent().getAggregation("rootControl"),
				flexSettings: {
					developerMode: false
				},
				stop: function() {
					oRuntimeAuthoring.destroy();
				}
			});
			oRuntimeAuthoring.start();
		}
	});

	Test.retrieveAllMetadata = function(oPanel) {
		if (!oPanel.getModel) {
			return [];
		}
		var oModel = oPanel.getModel("$sapuimdcbasesampleinfoexample_panel");
		return jQuery.extend(true, [], oModel.getProperty("/metadata"));
	};
	Test.retrieveBaseline = function(oPanel) {
		if (!oPanel.getModel) {
			return [];
		}
		var oModel = oPanel.getModel("$sapuimdcbasesampleinfoexample_panel");
		return jQuery.extend(true, [], oModel.getProperty("/baseline"));
	};

	return Test;
}, true);
