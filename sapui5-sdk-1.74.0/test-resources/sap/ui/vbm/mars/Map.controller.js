sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("mars.Map", {
		oData: {
			Features: [{
				"id": "DEU",
				"tooltip": "Germany",
				"color": "rgba(92,186,230,0.6)"
			}]
		},

		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(this.oData);
			this.getView().setModel(oModel);
			this.oVBI = this.getView().byId("VBMars");

			var oMapConfig = {
				"MapProvider": [
					{
						"name": "MARS",
						"type": "",
						"description": "",
						"tileX": "256",
						"tileY": "256",
						"maxLOD": "18",
						"Source": [{
							"id": "s1",
						//	"url": "http://b.tiles.mapbox.com/v3/herwig.mars-terrain/{LOD}/{X}/{Y}.png"
							"url": "http://int.nyt.com/newsgraphics/map-tiles/2013/mars-curiosity-v3/{LOD}/{X}/{Y}.png"
						//	"url" : "http://gmaps-bkup.uahirise.org/mars/visible/{LOD}/{X}/{Y}.jpg"
						}]
					} 
				],
				"MapLayerStacks": [
					{
						"name": "Default",
						"MapLayer":  {
							"name": "layer1",
							"refMapProvider": "MARS",
							"opacity": "1.0",
							"colBkgnd": "RGB(255,255,255)"
						}
					}
				]
			};
			this.oVBI.setMapConfiguration(oMapConfig);
			
		
//			var NewCombineUrl = function(x, y, lod) {
//				// do load balancing for different sources...........................//
//				
//				var nMax = 1 << lod;
//				// check levels......................................................//
//				if (x < 0 || y < 0 || (x >= nMax) || (y >= nMax)) {
//					return null;
//				}
//				
//				// check and determine size..........................................//
//				if (this.m_SourceArray.length == 0) {
//					return null;
//				}
//				
//				y = nMax - 1- y;
//				// do load balancing on server, assuring cache consistency...........//
//				return this.m_SourceArray[((y + x * nMax) % this.m_SourceArray.length)].CombineUrl(x, y, lod);
//			};
			
//			this.oVBI.addEventDelegate({
//				onAfterRendering: function (e) {
//					e.srcControl.mVBIContext.GetMainScene().m_RefMapLayerStack.m_MapLayerArray[0].m_refMapProvider.CombineUrl = NewCombineUrl;
//					
//				}
//			})
			
		}
	});
});
