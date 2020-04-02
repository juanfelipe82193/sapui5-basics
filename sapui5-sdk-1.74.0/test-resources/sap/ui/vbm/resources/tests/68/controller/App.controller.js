
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vbm/GeoMap",
	"sap/ui/model/json/JSONModel",
	"sap/m/FlexItemData",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/Text"
], function(Controller, GeoMap, JSONModel, FlexItemData, Dialog, Button, Text) {
	"use strict";
	return Controller.extend("vbm-regression.tests.68.controller.App", {

		onInit: function() {
			
			var model = new JSONModel();
			model.setData();
			
			var externalPieItem = new sap.ui.vbm.PieItem( "item1", 
			  { 
			      value: '10', 
			      name: 'pieItem1', 
				  color: 'RGB(80,0,150)',
				  tooltip: 'Item10'
			  });
			
			var geoMap = new GeoMap("map", {
				width: "100%",
				height: "100%",
				vos: [
					new sap.ui.vbm.Pies ("PiesAggregation", {
						/* Hook up click and contextMenu events on Pies Aggregation */
						click: this.onClickPie,
						contextMenu: this.onRightClickPie,
						items: [ 
							new sap.ui.vbm.Pie("PieChart", { 
									scale: '3;1;1', 
									position: "1;1;1",
									/* Hook up click and contextMenu events on Pie VO */
									click: this.onClickPie,
									contextMenu: this.onRightClickPie,
									items: [ 
										externalPieItem,
											new sap.ui.vbm.PieItem( "item2", { value: '20', name: 'pieItem2', tooltip: 'Item20'}  ),
											new sap.ui.vbm.PieItem( "item3", { value: '30', name: 'pieItem3', color: 'RGB(65,230,220)', tooltip: 'Item30' }  ),
											new sap.ui.vbm.PieItem( "item4", { value: '40', name: 'pieItem4', color: 'RGBA(244,66,185,150)', tooltip: 'Item40' }  )
										]
								  }) 
						 ]
					})
				]
			});

			geoMap.setModel(model);
			geoMap.setMapConfiguration(GLOBAL_MAP_CONFIG);
			geoMap.setLayoutData(new FlexItemData({
				baseSize: "100%"
			}));
			this.getView().byId("flexBox").insertItem(geoMap);
		},

		onClickPie: function ( evt ) {
			var clickedItem;
			/* Get the pie item index (#) using AddActionProperty attribute "name" of the click event of Pie or Pies */
			evt.mParameters.data.Action.AddActionProperties.AddActionProperty.forEach(function (item) {
				if (item.name === "pieitem") {
					clickedItem = item["#"];
				}
			});
			
			var dialog = new Dialog({
				title: 'Event Information',
				type: 'Message',
					content: new Text({
						text: "Click event on " + this + ": " + evt.oSource.getId() + " and pie item index is: " + clickedItem
					}),
				beginButton: new Button({
					text: 'OK',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		},

		onRightClickPie: function ( evt ) {
			var rightClickedItem;
			/* Get the pie item index (#) using AddActionProperty attribute "name" of the context menu event of Pie or Pies */
			evt.mParameters.data.Action.AddActionProperties.AddActionProperty.forEach(function (item) {
				if (item.name === "pieitem") {
					rightClickedItem = item["#"];
				}
			});

			var dialog = new Dialog({
				title: 'Event Information',
				type: 'Message',
					content: new Text({
						text: "Context menu event on " + this + ": " + evt.oSource.getId() + " and pie item index is: " + rightClickedItem
					}),
				beginButton: new Button({
					text: 'OK',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		}

	});
});

