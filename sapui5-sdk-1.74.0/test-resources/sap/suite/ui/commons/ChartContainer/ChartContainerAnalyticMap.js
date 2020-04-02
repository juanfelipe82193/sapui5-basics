//
// Analytic MAP
//

oChartContainerAnalyticMap = function() {
	sap.ui.vbm.AnalyticMap.GeoJSONURL = "../../../../../test-resources/sap/suite/ui/commons/ChartContainer/AnalyticMap.json";
	// create some dummy data
	var oData = {
		regionProperties : [{
			"code" : "EU",
			"legend" : "Europe",
			"color" : "rgba(184,225,245,1.0)",
			"tooltip" : "Europe\r\n\r\nPopulation: 743 Mio"
		}, {
			"code" : "NA",
			"legend" : "North America",
			"color" : "rgba(5,71,102,1.0)"
		}, {
			"code" : "OC",
			"legend" : "Oceania",
			"color" : "rgba(0,125,192,1.0)"
		}]
	};

	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(oData);

	// create analytic map with legend and bind to model
	var oAnalyticMap = new sap.ui.vbm.AnalyticMap('legend', {
		width : "100%",
		plugin : false,
		regions : {
			path : "/regionProperties",
			template : new sap.ui.vbm.Region({
				code : "{code}",
				color : '{color}',
				tooltip : '{tooltip}'
			})
		},

		legend : new sap.ui.vbm.Legend({
			caption : "Analytic Legend",
			items : {
				path : "/regionProperties",
				template : new sap.ui.vbm.LegendItem({
					text : "{legend}",
					color : '{color}',
					tooltip : '{tooltip}'
				})
			}
		})
	});

	oAnalyticMap.setModel(oModel);

	return oAnalyticMap;
};