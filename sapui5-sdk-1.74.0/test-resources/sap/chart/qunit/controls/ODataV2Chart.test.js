/*global QUnit, sinon */

QUnit.config.autostart = false;

sap.ui.require([
	'sap/chart/Chart',
	'sap/chart/data/Dimension',
	'sap/chart/data/Measure',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/layout/VerticalLayout'
], function(
	Chart,
	Dimension,
	Measure,
	ODataModel,
	VerticalLayout
) {
	"use strict";

	var sServiceURI = "http://anaChartFakeService:8080/";
	window.anaChartFakeService.fake({
		baseURI: sServiceURI
	});
	sinon.config.useFakeTimers = false;
	var sResultPath = "/nhl";
	var oModel, oVerticalLayout, oChart, sLocale;
	QUnit.module("AnalyticalChart", {
		beforeEach: function() {
			sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			oModel = new ODataModel(sServiceURI,true);
			oVerticalLayout = new VerticalLayout({
				width: "100%"
			});
		},
		afterEach: function() {
			try {
				if (oModel) {
					oModel.destroy();
				}
				if (oChart) {
					oChart.destroy();
				}
				if (oVerticalLayout) {
					oVerticalLayout.destroy();
				}
				sap.ui.getCore().getConfiguration().setLanguage(sLocale);
				document.getElementById("qunit-fixture").innerHTML = "";
			} catch (e) {
				// ignore
			}
		}
	});

	QUnit.test("Create Chart with odata v2", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			"chartType" :"column",
			"uiConfig" : {"applicationSet" : "fiori"},
			"isAnalytical" : true,
			"visibleDimensions": ["SHOOTS", "POSITION"],
			"visibleMeasures": ["GOALS", "PLUS_MINUS"]

		});
		var dims = [
			new Dimension({ name: "SHOOTS", role: "category" }),
			new Dimension({ name: "POSITION", role: "category" }),
			new Dimension({ name: "DIVISION_NAME", role: "series" })
		];
		dims.forEach(function (dim) { oChart.addDimension(dim); });

		var meas = [
			new Measure({ name: "GOALS", role: "axis1" }),
			new Measure({ name: "PLUS_MINUS", role: "axis1" })
		];
		meas.forEach(function (mea) { oChart.addMeasure(mea); });

		oChart.setModel(oModel);
		oModel.attachMetadataLoaded(function(){
			oChart.bindData({
				path: sResultPath
			});
		});
		oChart.attachRenderComplete(function() {
			assert.equal(document.querySelectorAll("#qunit-fixture .v-m-categoryAxis .v-label-group g")[0].textContent, "Center");
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			done();
		});
		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.start();

});