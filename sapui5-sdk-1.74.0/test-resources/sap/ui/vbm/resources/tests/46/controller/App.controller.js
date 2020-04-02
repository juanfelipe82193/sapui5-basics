sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.46.controller.App", {

		onInit: function() {

			var containers = [
				{
					"key": "10",
					"pos": "70;0;0",
					"tooltip": "Container1",
					ChartCols: [{
							"value": 6,
							"color": "Neutral"
							},
						{
							"value": 100,
							"color": "Error"
							},
						{
							"value": 20,
							"color": "Good"
							}]
						},
				{
					"key": "11",
					"pos": "70;30;0",
					"tooltip": "Container2",
					ChartCols: [{
							"value": 50,
							"color": "Neutral"
							},
						{
							"value": 8,
							"color": "Error"
							},
						{
							"value": 16,
							"color": "Good"
							},
						{
							"value": 24,
							"color": "Error"
							}]
						},
				{
					"key": "12",
					"pos": "70;60;0",
					"tooltip": "Container3",
					ChartCols: [{
							"value": 70,
							"color": "Neutral"
							},
						{
							"value": 5,
							"color": "Error"
							},
						{
							"value": 100,
							"color": "Neutral"
							},
						{
							"value": 4,
							"color": "Error"
							}]
						}
					];


			var dataModel = {
				map: {
					mapConfiguration: GLOBAL_MAP_CONFIG
				},
				containers: containers
			};

			jQuery.sap.require("sap.ui.model.json.JSONModel");
			var model = new sap.ui.model.json.JSONModel(dataModel);
			this.getView().setModel(model);
		},

		onClickItem: function(event) {
			event.oSource.openDetailWindow("Details");
		},

		onContextMenuItem: function(evt) {
			var oMenu = evt.getParameter("menu");
			oMenu.addItem(new sap.ui.unified.MenuItem({
				text: "Any function"
			}));
			evt.oSource.openContextMenu(oMenu);
		},

		onRemoveContainerModel: function() {
			var changedData = this.getView().getModel().getData();
			changedData.containers.pop();
			this.getView().getModel().setData(changedData);
		},

		onRemoveContainerVO: function() {
			var allContainers = this.byId("containers").getItems();
			this.byId("containers").removeItem(allContainers[allContainers.length - 1]);
		},

		onAddContainerVO: function() {
			this.byId("containers").insertItem(new sap.ui.vbm.Container({
				position: "70;50;0",
				item: new sap.m.Label({
					design: "Bold",
					text: "NEW CONTAINER"
				})
			}))
		}

	});
});
