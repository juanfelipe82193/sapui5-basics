sap.ui.define([
	"sap/ui/vbdemos/component/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.vbdemos.selection.Main", {
		onInit: function() {
			var oData = 
			{
					Spots :
					[
						{ "key" : "1", "pos": "13.407965;52.517906;0",  "tooltip": "Berlin", "type":sap.ui.vbm.SemanticType.Success, "select": true },  
						{ "key":  "2", "pos": "-3.704257;40.418071;0", "tooltip": "Madrid", "type":sap.ui.vbm.SemanticType.Success, "select": false },  
						{ "key":  "3", "pos": "37.613250;55.747928;0", "tooltip": "Moscow", "type":sap.ui.vbm.SemanticType.Success, "select": false },  
						{ "key":  "4", "pos": "2.347899;48.855675;0", "tooltip": "Paris", "type":sap.ui.vbm.SemanticType.Success, "select": false }  ,
						{ "key" : "5", "pos": "-0.127697;51.509331;0",  "tooltip": "London", "type":sap.ui.vbm.SemanticType.Success, "select": false },  
						{ "key":  "6", "pos": "14.266513;40.851627;0", "tooltip": "Napoli", "type":sap.ui.vbm.SemanticType.Success, "select": false },  
						{ "key":  "7", "pos": "16.370441;48.206873;0", "tooltip": "Wien", "type":sap.ui.vbm.SemanticType.Success, "select": false },
						{ "key":  "8", "pos": "10.751470;59.914495;0", "tooltip": "Oslo", "type":sap.ui.vbm.SemanticType.Success, "select": false }  				 
					]		
			};

			// create model and set the data
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oData);
			this.getView().setModel(oModel);
			this.oVBI = this.getView().byId("VBISelection");
		
		},
		onSelectionChanged: function(e) {
			var oModel = this.getView().getModel();
			var spots = oModel.getData().Spots;
			var lons = [];
			var lats = [];
			for (var nJ = 0; nJ < spots.length; ++nJ) {
				if (spots[nJ].select) {
					var pos = spots[nJ].pos.split(";");
					lons.push(pos[0]);
					lats.push(pos[1]);
				}
			}
			if (lons.length && lats.length) {
				if (lons.length == 1 && lats.length == 1) {
					this.oVBI.zoomToGeoPosition(lons, lats, 5);
				} else {
					this.oVBI.zoomToGeoPosition(lons, lats);
				}
			}
		}

	});
});
