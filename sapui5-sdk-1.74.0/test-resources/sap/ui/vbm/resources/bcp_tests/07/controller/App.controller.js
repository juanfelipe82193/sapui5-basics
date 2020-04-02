sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
   ],function(JSONModel, Device) {
"use strict";

sap.ui.controller("vbm-regression.bcp_tests.07.controller.App", {

	onInit : function () {
		var data = {
			"Legend": 
				[
					{
						"text": "Default route",
						"color": "rgb(92,186,230)"
					}
				]
	};

		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(data);
		this.getView().setModel(oModel);

		// set the device model
		var oDeviceModel = new JSONModel(Device);
		oDeviceModel.setDefaultBindingMode("OneWay");
		this.getView().setModel(oDeviceModel, "device");
	},
	  
	onPressLegend: function ()	{
		if(this.byId("vbi").getLegendVisible()==true){
			this.byId("vbi").setLegendVisible(false);
			this.byId("btnLegend").setTooltip("Show legend");
		}
		else{
			this.byId("vbi").setLegendVisible(true);
			this.byId("btnLegend").setTooltip("Hide legend");
		}
	},

	onPressResize: function ()	{
		if(this.byId("btnResize").getTooltip()=="Minimize"){
			if (sap.ui.Device.system.phone) {
				this.byId("vbi").minimize(132,56,1320,560);//Height: 3,5 rem; Width: 8,25 rem
			} else {
				this.byId("vbi").minimize(168,72,1680,720);//Height: 4,5 rem; Width: 10,5 rem
			}				
			this.byId("btnResize").setTooltip("Maximize");
		}
		else{
			this.byId("vbi").maximize();
			this.byId("btnResize").setTooltip("Minimize");
		}
	},

	onClickItem: function (evt)	{
		//		alert("onClick");
	},

	onContextMenuItem: function ( evt )	{
		alert("onContextMenu");
	},

	onClickRoute: function (evt)	{
		//		alert("Route onClick");
		evt.getSource().openDetailWindow("My Detail Window", "0;0;0");  		
	},

	onContextMenuRoute: function ( evt )	{
		//		alert("Route onContextMenu");
		if ( evt.mParameters && evt.mParameters.menu )
		{ 
		//Function to handle the select event of the items
			var handleSelect = function(oEvent){
				alert("clicked on " + oEvent.oSource.mProperties.text);
			};

			// Create the menu
			var oMenu11 = evt.mParameters.menu;
			//Create the items and add them to the menu
			var oMenuItem11 = new sap.ui.unified.MenuItem({text: "First Item"}); 
			oMenuItem11.attachSelect(handleSelect);
			oMenu11.addItem(oMenuItem11);
			var oMenuItem12 = new sap.ui.unified.MenuItem({text: "Second Item"});
			oMenuItem12.attachSelect(handleSelect);
			oMenu11.addItem(oMenuItem12);
			var oMenuItem13 = new sap.ui.unified.MenuItem({text: "Disabled Item", enabled: false});
			oMenu11.addItem(oMenuItem13);

			//Create a sub menu for second item
			var oMenu21 = new sap.ui.unified.Menu({ariaDescription: "a sub menu"});
			oMenuItem12.setSubmenu(oMenu21);
			//Create the items and add them to the sub menu
			var oMenuItem14 = new sap.ui.unified.MenuItem({text: "New TXT file", tooltip: "Creates a new TXT file."});
			oMenuItem14.attachSelect(handleSelect);
			oMenu21.addItem(oMenuItem14);
			var oMenuItem15 = new sap.ui.unified.MenuItem({text: "New RAR file", tooltip: "Creates a new RAR file."});
			oMenuItem15.attachSelect(handleSelect);
			oMenu21.addItem(oMenuItem15);

			evt.getSource().openContextMenu( oMenu11 );  

		}

	},

	onZoomIn : function() {
		this.byId("vbi").zoomToGeoPosition(10,51,5);
	},

	onCloseDetail: function (evt) {
		//alert("onCloseDetail" + this);
	},

	onOpenDetail: function (evt) {
		var cont = document.getElementById(evt.getParameter("contentarea").id);
		cont.innerHTML = "Content for Routes";
		cont.style.color = "Blue";      
	}

});

}, /* bExport= */ true);
