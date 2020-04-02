sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.25.controller.App", {

		onInit: function() {


			jQuery.sap.require("sap.ui.commons.Panel");
			jQuery.sap.require("sap.ui.core.Title");
			jQuery.sap.require("sap.ui.commons.layout.MatrixLayout");
			jQuery.sap.require("sap.ui.commons.Label");
			jQuery.sap.require("sap.ui.commons.TextField");
			jQuery.sap.require("sap.ui.commons.Button");

			var vbi1 = this.byId("vbi1"),
				vbi2 = this.byId("vbi2"),
				vbi3 = this.byId("vbi3");

			// load the json and set the default text area text
			$.getJSON("media/vbdetail/main.json", function(data) {
				var userStoredData = GLOBAL_MAP_CONFIG;
				data.SAPVB.MapLayerStacks.Set.MapLayerStack = userStoredData.MapLayerStacks;
				data.SAPVB.MapProviders.Set.MapProvider = userStoredData.MapProvider;

				var scene = userStoredData.MapLayerStacks;
				if (scene instanceof Array) {
					data.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks[0].name;
				} else {
					data.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks.name;
				}
				vbi1.load(data);
				vbi2.load(data);
				vbi3.load(data);

				$.getJSON("media/vbdetail/opendetail1.json", function(dat) {
					vbi1.load(dat);
					vbi1.zoomToGeoPosition(30, 45, 4);
				});

				$.getJSON("media/vbdetail/opendetail2.json", function(dat) {
					vbi2.load(dat);
					vbi2.zoomToGeoPosition(30, 20, 1);
				});

				$.getJSON("media/vbdetail/opendetail3.json", function(dat) {
					vbi3.load(dat);
					vbi3.zoomToGeoPosition(30, 20, 1);
				});
			});

		},

		onOpenWindow: function(event) {
			var oPanel = new sap.ui.commons.Panel({
				width: "350px",
				showCollapseIcon: false
			});
			oPanel.setAreaDesign(sap.ui.commons.enums.AreaDesign.Plain);
			oPanel.setBorderDesign(sap.ui.commons.enums.BorderDesign.None);

			//Set the title of the panel
			oPanel.setTitle(new sap.ui.core.Title({
				text: "Location Data"
			}));
			//As alternative if no icon is desired also the following shortcut might be possible:
			//oPanel.setText("Contact Data");

			//Create a matrix layout with 2 columns
			var oMatrix = new sap.ui.commons.layout.MatrixLayout({
				layoutFixed: true,
				width: '300px',
				columns: 2
			});
			oMatrix.setWidths('100px', '200px');

			//Create a simple form within the layout
			var oLabel = new sap.ui.commons.Label({
				text: 'Name'
			});
			var oInput = new sap.ui.commons.TextField({
				value: 'Mustermann',
				width: '100%'
			});
			oLabel.setLabelFor(oInput);
			oMatrix.createRow(oLabel, oInput);

			oLabel = new sap.ui.commons.Label({
				text: 'First Name'
			});
			oInput = new sap.ui.commons.TextField({
				value: 'Max',
				width: '100%'
			});
			oLabel.setLabelFor(oInput);
			oMatrix.createRow(oLabel, oInput);
			//Add some buttons 
			oMatrix.createRow(new sap.ui.commons.Button({
				text: 'Save'
			}), new sap.ui.commons.Button({
				text: 'Cancel'
			}));
			//Add the form to the panels content area
			oPanel.addContent(oMatrix);

			//Attach the panel to the page
			oPanel.placeAt(event.getParameter("contentarea").id);

		}

	});
});
