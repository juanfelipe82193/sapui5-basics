sap.ui.define([
	"sap/ui/vbdemos/component/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.vbdemos.analytic.Main", {
		onInit: function() {
			this.oData = {
				regionProperties:

				[
					{
						"code": "DE",
						"region": "Germany",
						"Revenue": 428214.13,
						"Cost": 94383.52,
						"color": "rgb(92,186,230)",
					}, {
						"code": "FR",
						"region": "France",
						"Revenue": 1722148.36,
						"Cost": 274735.17,
						"color": "rgb(182,217,87)"
					}, {
						"code": "IT",
						"region": "Italy",
						"Revenue": 1331176.706884,
						"Cost": 233160.58,
						"color": "rgb(250,195,100)"
					}, {
						"code": "GR",
						"region": "Greece",
						"Revenue": 1878466.82,
						"Cost": 235072.19,
						"color": "rgb(110,139,61)"
					}, {
						"code": "ES",
						"region": "Spain",
						"Revenue": 3326251.94,
						"Cost": 582543.16,
						"color": "rgb(217,152,203)"
					}, {
						"code": "PT",
						"region": "Portugal",
						"Revenue": 2090030.97,
						"Cost": 397952.77,
						"color": "rgb(242,210,73)"
					}
				]

			};

			// Analytic Map: create model, set the data and set the model
			this.oModel = new sap.ui.model.json.JSONModel();
			this.oModel.setData(this.oData);
			this.oVBI = this.getView().byId("VBIAnalytic");
			this.oVBI.setModel(this.oModel);

			// Analytic Map: create and set the legend
			this.oLegend = new sap.ui.vbm.Legend({
				caption: "Analytic Legend",
				items: {
					path: "/regionProperties",
					template: new sap.ui.vbm.LegendItem({
						text: "{region}",
						color: '{color}'
					})
				}
			});
			this.oVBI.setLegend(this.oLegend);

			// Chart: create model, set the data and set the model
			this.oChartModel = new sap.ui.model.json.JSONModel();
			this.oChartModel.setData(this.oData);
			this.oChart = this.getView().byId("ChartAnalytic");
			this.oChart.setModel(this.oChartModel);

			// Chart: set VizScales and VizProperties
			this.oChart.setVizScales([
				{
					feed: "color",
					palette: [
						"#AED1DA", "#121212"
					]

				}
			]);
			this.oChart.setVizProperties({
				general: {
					layout: {
						padding: 0.04
					}
				},
				valueAxis: {
					title: {
						visible: true
					}
				},
				categoryAxis: {
					title: {
						visible: true
					}
				},
				plotArea: {

					dataLabel: {
						visible: true,
						style: {
							color: null
						}
					}
				},
				legend: {
					title: {
						visible: true
					}
				},
				title: {
					visible: true,
					text: 'Revenue and Cost by Region'
				}
			});

			this.Selection = {}, this.aFilter = [];
		},

		refreshFilter: function(e) {
			this.aFilter = [];
			for (var j = 0; j < this.oData.regionProperties.length; j++) {
				var oFilter = this.oData.regionProperties[j];
				if (this.Selection[oFilter.code]) {
					this.aFilter.push(oFilter);
				}
			}
			if (this.aFilter.length < 1) {
				// no filter
				this.oChartModel.setData(this.oData);
			} else {
				this.oChartModel.setData({
					"regionProperties": this.aFilter
				});
			}

		},
		handleSelect: function(e) {
			var oObject = e.getParameters().selected[0];
			this.Selection[oObject.getProperty("code")] = true;
			this.refreshFilter();
		},
		handleDeselect: function(e) {
			var aRegionProperties = e.getParameters().deselected;
			for (var j = 0; j < aRegionProperties.length; j++) {
				delete this.Selection[aRegionProperties[j].getCode()];
			}
			this.refreshFilter();
		}
	});
});
