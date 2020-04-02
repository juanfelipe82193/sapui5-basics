sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/ui/layout/form/SimpleForm", "sap/m/Label", "sap/m/Text"
], function(Controller, MessageToast, SimpleForm, Label, Text) {
	"use strict";
	var oForm = null;
	return Controller.extend("vbm-regression.tests.40.controller.App", {
		onInit: function() {
			
			jQuery.sap.require("sap.ui.unified.MenuItem");
			var data = {
				mapConfiguration: GLOBAL_MAP_CONFIG
			};
			var model = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(model);
		},

		onSpotContextMenu: function(event) {
			var activeSpot = event.getSource().getText();
			var oMenu = event.mParameters.menu;
			oMenu.addItem(new sap.ui.unified.MenuItem({
				text: "Spot text: " + activeSpot
			}));
			event.getSource().openContextMenu(oMenu);
		},

		onSpotClick: function(event) {
			var spotContext = event.getSource();
			spotContext.openDetailWindow(spotContext.getType() + " spot details");
			spotContext.getParent().getParent().attachEventOnce("openWindow", this.onOpenDetail, spotContext);
		},

		onOpenDetail: function(event) {
			if (!oForm) {
					oForm = new SimpleForm({
							maxContainerCols: 1,
							width: "200px",
							labelMinWidth: 50,
							content: [
								new Label({
									text:"Position"
								}),
								new Text({
									text:this.getPosition()
								})
							]
					});
			}
			oForm.placeAt(event.getParameter("contentarea").id);
		},

		openDWindow: function() { 
			var gMap = this.byId("geoMap");
			gMap.openDetailWindow( "8.5;49.5;0", { caption : "Unrelated Detail Window"});
		},

		closeDetailWindow: function() {
			var gMap = this.byId("geoMap");
			gMap.closeAnyDetailWindow();
		}
	});
});
