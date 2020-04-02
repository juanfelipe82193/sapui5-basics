sap.ui.define([
           	"sap/ui/vbdemos/component/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.vbdemos.drilldown.Main", {
		oVBI : null,
		currentDetailLevel: 0,
	onZoomChanged : function (e) {
		var oVBI = this.oVBI;
		if(oVBI) {
			var switchZoomLevel = 5;
			var zl = e.getParameter( "zoomLevel" );
			var oModel = this.getView().getModel();
			if(oVBI.getFeatureCollections().length > 0) {
				if (zl > switchZoomLevel && this.currentDetailLevel === 0 ){
					oModel.setData( this.oDataDetail );
					this.currentDetailLevel = 1;
				}else if (zl <= switchZoomLevel && this.currentDetailLevel === 1 ){
					oModel.setData( this.oData );
					this.currentDetailLevel = 0;
				}
				oVBI.removeFeatureCollection(this.FCRef);
				this.addFeatureCollection(this.currentDetailLevel);
			}
		}
	},
	 oData :	{
		Features :
			[ { "id": "DEU", "tooltip": "Germany", "color": "rgba(92,186,230,0.6)"}
			]	
	},
	 oDataDetail :
	{
		Features :
			[ 
			  { "id": "DE-BB", "tooltip": "Brandenburg", "color": "rgba(92,186,230,0.6)"},
			  { "id": "DE-BE", "tooltip": "Berlin", "color": "rgba(182,217,87,0.6)"},
			  { "id": "DE-BW", "tooltip": "Baden-W\u00FCrttemberg", "color": "rgba(217,152,203,0.6)"},
			  { "id": "DE-BY", "tooltip": "Bayern", "color": "rgba(140,211,255,0.6)"},
			  { "id": "DE-HB", "tooltip": "Bremen", "color": "rgba(217,152,203,0.6)"},
			  { "id": "DE-HE", "tooltip": "Hessen", "color": "rgba(242,210,73,0.6)"},
			  { "id": "DE-HH", "tooltip": "Hamburg", "color": "rgba(250,195,100,0.6)"},
			  { "id": "DE-MV", "tooltip": "Mecklenburg-Vorpommern", "color": "rgba(219,219,70,0.6)"},
			  { "id": "DE-NI", "tooltip": "Niedersachsen", "color": "rgba(82,186,204,0.6)"},
			  { "id": "DE-NW", "tooltip": "Nordrhein-Westfalen", "color": "rgba(204,197,168,0.6)"},
			  { "id": "DE-RP", "tooltip": "Rheinland-Pfalz", "color": "rgba(152,170,251,0.6)"},
			  { "id": "DE-SH", "tooltip": "Schleswig-Holstein", "color": "rgba(152,170,251,0.6)"},
			  { "id": "DE-SL", "tooltip": "Saarland", "color": "rgba(182,217,87,0.6)"},
			  { "id": "DE-SN", "tooltip": "Sachsen", "color": "rgba(250,195,100,0.6)"},
			  { "id": "DE-ST", "tooltip": "Sachsen-Anhalt", "color": "rgba(217,152,203,0.6)"},
			  { "id": "DE-TH", "tooltip": "Th\u00FCringen", "color": "rgba(152,170,251,0.6)"}
			]	
	},   
	onInit : function () {
//		var oVBI = this.oVBI;
		
	 
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData( this.oData );
		this.getView().setModel(oModel);
		this.oVBI = this.getView().byId("VBIDrillDown");
		this.addFeatureCollection(0);
	
	},
	FCRef : null,
	addFeatureCollection : function ( currentDetailLevel ) {
		this.FCRef = new sap.ui.vbm.FeatureCollection( {
			srcURL: (!currentDetailLevel) ? "media/L0_DE.json" : "media/L1_DE.json",
			click : this.onClickFC.bind(this), 	  			
			items: {
				path: "/Features",
				template: new sap.ui.vbm.Feature( 
			                                  {
			                                	  color: '{color}', 
				                                tooltip:'{tooltip}',
				                             	featureId : '{id}'
				                             })
					}
				}
			);

			this.oVBI.addFeatureCollection(this.FCRef);

		},
		onClickFC : function (e){
			var id = e.getParameter("featureId");
			var FeatureIds = [id];
			var datas = this.FCRef.getFeaturesInfo(FeatureIds);
			var bbs = [datas[id].BBox];
			this.oVBI.zoomToAreas(bbs, 0.95);
			
		}	
	});
});
