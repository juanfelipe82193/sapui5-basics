sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.60.controller.App", {

		onInit: function() {

			var regionProperties = [{
					"code": "DE",
					"region": "Germany",
					"color": "rgb(92,186,230)",
					"text": "Central Europe",
					"select": true
				}, {
					"code": "CZ",
					"region": "Czech Republic",
					"color": "rgb(92,186,230)",
					"text": "Central Europe",
					"select": false
				}, {
					"code": "PL",
					"region": "Poland",
					"color": "rgb(92,186,230)",
					"text": "Central Europe",
					"select": false
				}, {
					"code": "SK",
					"region": "Slovakia",
					"color": "rgb(92,186,230)",
					"text": "Central Europe",
					"select": false
				}, {
					"code": "HU",
					"region": "Hungary",
					"color": "rgb(92,186,230)",
					"text": "Central Europe",
					"select": false
				}, {
					"code": "AT",
					"region": "Austria",
					"color": "rgb(92,186,230)",
					"text": "Central Europe",
					"select": false
				}, {
					"code": "SI",
					"region": "Slovenia",
					"color": "rgb(92,186,230)",
					"text": "Central Europe",
					"select": false
				}, {
					"code": "CH",
					"region": "Switzerland",
					"color": "rgb(92,186,230)",
					"text": "Central Europe",
					"select": false
				}, {
					"code": "LI",
					"region": "Liechtenstein",
					"color": "rgb(92,186,230)",
					"text": "Central Europe"
				}, {
					"code": "EE",
					"region": "Estonia",
					"color": "rgb(182,217,87)",
					"text": "Eastern Europe"
				}, {
					"code": "LV",
					"region": "Latvia",
					"color": "rgb(182,217,87)",
					"text": "Eastern Europe"
				}, {
					"code": "LT",
					"region": "Lithuania",
					"color": "rgb(182,217,87)",
					"text": "Eastern Europe"
				}, {
					"code": "BY",
					"region": "Belarus",
					"color": "rgb(182,217,87)",
					"text": "Eastern Europe"
				}, {
					"code": "RU",
					"region": "Russia",
					"color": "rgb(182,217,87)",
					"text": "Eastern Europe"
				}, {
					"code": "UA",
					"region": "Ukraine",
					"color": "rgb(182,217,87)",
					"text": "Eastern Europe"
				}, {
					"code": "PT",
					"region": "Portugal",
					"color": "rgb(250,195,100)",
					"text": "Southern Europe"
				}, {
					"code": "ES",
					"region": "Spain",
					"color": "rgb(250,195,100)",
					"text": "Southern Europe"
				}, {
					"code": "IT",
					"region": "Italy",
					"color": "rgb(250,195,100)",
					"text": "Southern Europe"
				}, {
					"code": "GR",
					"region": "Greece",
					"color": "rgb(250,195,100)",
					"text": "Southern Europe"
				}, {
					"code": "MK",
					"region": "Macedonia",
					"color": "rgb(250,195,100)",
					"text": "Southern Europe"
				}, {
					"code": "IE",
					"region": "Ireland",
					"color": "rgb(140,211,255)",
					"text": "Western Europe"
				}, {
					"code": "GB",
					"region": "United Kingdom",
					"color": "rgb(140,211,255)",
					"text": "Western Europe"
				}, {
					"code": "FR",
					"region": "France",
					"color": "rgb(140,211,255)",
					"text": "Western Europe"
				}, {
					"code": "BE",
					"region": "Belgium",
					"color": "rgb(140,211,255)",
					"text": "Western Europe"
				}, {
					"code": "NL",
					"region": "Netherlands",
					"color": "rgb(140,211,255)",
					"text": "Western Europe"
				}, {
					"code": "LU",
					"region": "Luxembourg",
					"color": "rgb(140,211,255)",
					"text": "Western Europe"
				}
			];

			var LegendItems = [{
				"color": "rgb(92,186,230)",
				"text": "Central Europe"
			}, {
				"color": "rgb(182,217,87)",
				"text": "Eastern Europe"
			}, {
				"color": "rgb(250,195,100)",
				"text": "Southern Europe"
			}, {
				"color": "rgb(140,211,255)",
				"text": "Western Europe"
			}];

			var dataModel = {
				map: {
					mapConfiguration: GLOBAL_MAP_CONFIG
				},
				regionProperties: regionProperties,
				LegendItems: LegendItems
			};

			jQuery.sap.require("sap.ui.model.json.JSONModel");
			var model = new sap.ui.model.json.JSONModel(dataModel);
			this.getView().setModel(model);

			sap.ui.vbm.AnalyticMap.GeoJSONURL = "media/analyticmap/L0.json";


		},

		onLegendItemClick: function(e) {

			var oModel = this.getView().getModel(),
				txt,
				sel,
				test,
				row;

			for (var nJ = 0; nJ < oModel.oData.regionProperties.length; ++nJ) {
				txt = "/regionProperties/" + nJ + "/text";
				sel = "/regionProperties/" + nJ + "/select";
				test = oModel.getProperty(txt);
				row = e.oSource.getText();
				if (test == row) {
					oModel.setProperty(sel, true);
				} else {
					oModel.setProperty(sel, false);
				}
			}

		}

	});
});
