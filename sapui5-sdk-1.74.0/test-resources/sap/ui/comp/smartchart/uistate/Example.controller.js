sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'test/sap/ui/comp/personalization/Util',
	'sap/m/TextArea',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/ui/comp/state/UIState'
], function(Controller, ODataModel, TestUtil, TextArea, Button, Dialog, UIState) {
	"use strict";

	return Controller.extend("root.Example", {

		onPressUIState: function() {
			var oSmartChart = this.byId("IDSmartChart");
			var oTextArea = new TextArea({
				rows: 20,
				width: "700px"
			});
			var oUIState = oSmartChart.getUiState();
			oTextArea.setValue("presentationVariant:\n" + JSON.stringify(oUIState.getPresentationVariant()) + "\nselectionVariant:\n" + JSON.stringify(oUIState.getSelectionVariant()) + "\nvariantName:\n" + oUIState.getVariantName());
			var oDialog = new Dialog({
				title: "Edit 'Data Suite Format'",
				content: oTextArea,
				beginButton: new Button({
					text: 'OK',
					press: function() {
						var sPresentationVariant = oTextArea.getValue().substring(0, oTextArea.getValue().indexOf("selectionVariant:"));
						var sSelectionVariant = oTextArea.getValue().substring(oTextArea.getValue().indexOf("selectionVariant:"), oTextArea.getValue().indexOf("variantName:"));
						var sVariantName = oTextArea.getValue().substring(oTextArea.getValue().indexOf("variantName:"));
						oSmartChart.setUiState(new UIState({
							presentationVariant: JSON.parse(sPresentationVariant.substring(sPresentationVariant.indexOf("{"))),
							selectionVariant: JSON.parse(sSelectionVariant.substring(sSelectionVariant.indexOf("{"))),
							variantName: sVariantName.substring(sVariantName.indexOf(":") + 1)
						}));
						oDialog.close();
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function() {
						oDialog.close();
					}
				})
			});
			oDialog.open();
		},
		onExit: function() {
			TestUtil.stopMockServer();
		}
	});
});
