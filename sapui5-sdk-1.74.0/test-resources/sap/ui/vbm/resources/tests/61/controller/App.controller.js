
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("vbm-regression.tests.61.controller.App", {

		onInit: function() {

			var regionProperties = [{
				"code": "DE",
				"region": "Germany",
				"color": "rgb(92,186,230)",
				"tooltip": "Germany\r\nBIP: 3.577 Mrd. USD\r\nPopulation: 80,716 Mio",
				"kpi": 4.50,
				"semanticType": sap.ui.vbm.SemanticType.Error
			}, {
				"code": "FR",
				"region": "France",
				"color": "rgb(182,217,87)",
				"kpi": 2.80,
				"semanticType": sap.ui.vbm.SemanticType.Warning
			}, {
				"code": "ES",
				"region": "Spain",
				"color": "rgb(255,0,100)",
				"kpi": 0.67,
				"semanticType": sap.ui.vbm.SemanticType.Success
			}, {
				"code": "CH",
				"region": "Switzerland",
				"color": "rgb(100,50,100)",
				"kpi": 0.7,
				"semanticType": sap.ui.vbm.SemanticType.Default
			}];
			
			
			var dataModel = {
				map: {
					mapConfiguration: GLOBAL_MAP_CONFIG
				},
				regionProperties: regionProperties
			};

			
			jQuery.sap.require("sap.ui.model.json.JSONModel");
			var oModel = new sap.ui.model.json.JSONModel(dataModel);
			this.getView().setModel(oModel);
			sap.ui.vbm.AnalyticMap.GeoJSONURL = "media/analyticmap/L0.json";

		}

	});
});
