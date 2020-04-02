/*global QUnit, $, JSONData */

QUnit.config.autostart = false;

sap.ui.require([
	'sap/chart/Chart',
	'sap/chart/data/Dimension',
	'sap/chart/data/TimeDimension',
	'sap/chart/data/Measure',
	'sap/chart/utils/RoleFitter',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/analytics/ODataModelAdapter',
	'sap/ui/model/analytics/AnalyticalTreeBindingAdapter',
	'sap/ui/layout/VerticalLayout',
	'sap/chart/utils/ChartTypeAdapterUtils'
], function(
	Chart,
	Dimension,
	TimeDimension,
	Measure,
	RoleFitter,
	JSONModel,
	ODataModelAdapter,
	AnalyticalTreeBindingAdapter,
	VerticalLayout,
	ChartTypeAdapterUtils
) {
	"use strict";

	var oModel, oVerticalLayout, oChart, sResultSet = "businessData", sResultPath = "/businessData";

	QUnit.module("AnalyticalChart", {
		beforeEach: function() {
			oModel = new JSONModel(JSONData);
			oVerticalLayout = new VerticalLayout({
				width: "100%"
			});
			oChart = new Chart({
				'width': '100%',
				'height': '600px',
				'chartType': 'column',
				'uiConfig': {
					'applicationSet': 'fiori'
				},
				'isAnalytical': true,
				'visibleDimensions': ['Sales_Quarter','Sales_Month'],
				'visibleMeasures': ['Cost', 'Unit Price']
			});

			var dims = [
				new Dimension({name:"Sales_Quarter",role:"category"}),
				new Dimension({name:"Sales_Month",role:"category"}),
				new Dimension({name:"Customer Gender",role:"series"})
			];
			dims.forEach(function(dim){oChart.addDimension(dim);});

			var meas = [
				new Measure({name:"Cost",role:"axis1"}),
				new Measure({name:"Unit Price",role:"axis1"}),
				new Measure({name:"Gross Profit",role:"axis1"})
			];
			meas.forEach(function(mea){oChart.addMeasure(mea);});

			oChart.bindData({
				path: sResultPath,
				parameters: {
					entitySet: sResultSet,
					noPaging: true,
					useBatchRequests: true,
					provideGrandTotals: true,
					provideTotalResultSize: true
				}
			});

			oChart.setModel(oModel);
			oVerticalLayout.addContent(oChart);
			oVerticalLayout.placeAt("qunit-fixture");
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
				document.getElementById("qunit-fixture").innerHTML = "";
			} catch (e) {
				// ignore
			}
		}
	});

	QUnit.test("Create Chart with JSONModel", function(assert) {
		var done = assert.async();
		oChart.attachRenderComplete(null, function(oEvent) {
			assert.equal(oEvent.getSource(), oChart, "renderComplete event is correct");
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			assert.equal(oChart.getVisibleDimensions().length, 3, "visibleDimensions are auto appended ");
			assert.equal(oChart.getIsAnalytical(), false, "the property isAnalytical passed by constructoer is ignored");
			done();
		});
	});

	QUnit.test("Chart zoom API test", function(assert) {
		var done = assert.async();
		oChart.setVizProperties({
			interaction: {
				zoom: {
					enablement: "enabled"
				}
			},
			plotArea: {
				window: {
					start: null,
					end: null
				}
			}
		});
		var zoomInfo, oldSize, newSize;
		oChart.attachEventOnce("_zoomDetected", null, checkZoomInEvent);

		function checkZoomInEvent() {
			zoomInfo = oChart.getZoomInfo();
			assert.equal(zoomInfo.enabled, true, "The chart supports zoom");
			assert.equal(zoomInfo.currentZoomLevel, 0, "The chart can't zoom out");
			oldSize = document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint")[0].getBBox();
			oChart.detachEvent("_zoomDetected", checkZoomInEvent);
			oChart.zoom({
				direction: "in"
			});
			oChart.attachEventOnce("_zoomDetected", null, checkZoomInInfo);
		}
		function checkZoomInInfo(e) {
			zoomInfo = oChart.getZoomInfo();
			assert.ok(zoomInfo.currentZoomLevel > 0, "The chart zoom in");
			var oParameters = e.getParameters();
			assert.equal(oParameters.name, "_zoomDetected", "The event name is right");
			assert.ok(oParameters.data.currentZoomLevel > 0, "The data of event is right");

			newSize = document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint")[0].getBBox();
			assert.ok(oldSize.width < newSize.width, "zoom API is correct");
			assert.equal(oChart.getVizUid(), oChart.getAggregation("_vizFrame").getVizUid(), "getVizUid API is correct");
			oldSize = newSize;
			oChart.detachEvent("_zoomDetected", checkZoomInInfo);
			oChart.attachEventOnce("_zoomDetected", null, checkZoomOutInfo);
			oChart.zoom({
				direction: "out"
			});
		}
		function checkZoomOutInfo() {
			zoomInfo = oChart.getZoomInfo();
			assert.equal(zoomInfo.currentZoomLevel, 0, "The chart can't zoom out");
			newSize = document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint")[0].getBBox();
			assert.ok(oldSize.width > newSize.width, "zoom API is correct");
			oChart.detachEvent("_zoomDetected", checkZoomOutInfo);
			oChart.attachEventOnce("renderComplete", null, checkZoomInfo);
			oChart.setVizProperties({
				interaction: {
					zoom: {
						enablement: "disabled"
					}
				}
			});
		}
		function checkZoomInfo() {
			zoomInfo = oChart.getZoomInfo();
			assert.equal(zoomInfo.enabled, false, "The chart can't zoom after set zooming disabled");
			assert.equal(zoomInfo.currentZoomLevel, null, "The chart Level is null when chart can't zoom ");
			oChart.detachRenderComplete(checkZoomInfo);
			done();
		}
	});

	QUnit.test("Chart Multiple Units test", function(assert) {
		var done = assert.async();
		oChart.setVizProperties({
			'plotArea': {
				'dataLabel': {
					'visible': true,
					'hideWhenOverlap': false
				},
				'isFixedDataPointSize': false
			}
		});
		oChart.setVisibleMeasures("Cost");
		oChart.getMeasureByName("Cost").setUnitBinding("SameCurrency");
		oChart.attachEventOnce("renderComplete", null, initRenderCb);
		function initRenderCb(oEvent) {
			assert.deepEqual(oChart.getInResultDimensions(), [], "Unit fields are not listed in inResultDimension.");
			var aDlDoms = [].slice.call(oChart.getDomRef().querySelectorAll(".v-datalabel"));
			assert.ok(aDlDoms.every(function(dom) {
				var data = dom.querySelector("text").textContent;
				return data.indexOf("USD") !== -1;
			}), "unit values are displayed along with each data point in data label.");
			oChart.detachRenderComplete(initRenderCb);
			oChart._getVizFrame().attachEventOnce("renderFail", null, setMultipleUnitsCb);
			oChart.getMeasureByName("Cost").setUnitBinding("Currency");
		}
		function setMultipleUnitsCb(oEvent) {
			assert.equal(this.$().find(".ui5-viz-controls-viz-description-title").text(), "Invalid data", "Invalid data message shows right");
			assert.equal(this.$().find(".ui5-viz-controls-viz-description-detail").text(), "Some measures have different units.", "Description of invalid data message shows right");
			oChart._getVizFrame().detachEvent("renderFail");
			oChart._getVizFrame().attachEventOnce("renderFail", null, setCustomMessagesCb);
			oChart.setCustomMessages({
				MULTIPLE_UNITS: "Sorry! Some Measures have more than one unit."
			});
		}
		function setCustomMessagesCb (oEvent) {
			assert.equal(this.$().find(".ui5-viz-controls-viz-description-message").text(), "Sorry! Some Measures have more than one unit.", "Customized multiple units message shows right");
			oChart._getVizFrame().detachEvent("renderFail");
			sap.ui.getCore().attachThemeChanged(changThemeCb);
			sap.ui.getCore().applyTheme("sap_hcb");
		}
		function changThemeCb(oEvent) {
			assert.equal($(".ui5-viz-controls-viz-description-message").css("color"), "rgb(255, 255, 255)", "Message color shows right when theme is changed");
			sap.ui.getCore().detachThemeScopingChanged();
			oChart.attachEventOnce("renderComplete", null, setUnitFromMultipleUnitsCb);
			oChart.setChartType("line");
			oChart.getMeasureByName("Cost").setUnitBinding("SameCurrency");
		}
		function setUnitFromMultipleUnitsCb(oEvent) {
			var aDlDoms = [].slice.call(oChart.getDomRef().querySelectorAll(".v-datalabel"));
			assert.ok(aDlDoms.every(function(dom) {
				var data = dom.querySelector("text").textContent;
				return data.indexOf("USD") !== -1;
			}), "unit values are displayed along with each data point in data label when correct unitBing is set.");
			assert.equal(oChart.getChartType(), "line", "chartType is set correctly");
			assert.equal(document.querySelectorAll("#qunit-fixture .v-datapoint-group .v-lines").length, 2, "Chart type is switched");
			// This is a bug BITSDC2-4870. Confirmed with PO, user can work around this case.
			//equal(oChart.getVizProperties().title.visible, false, "chartType is set correctly");
			oChart.detachRenderComplete(setUnitFromMultipleUnitsCb);
			oChart.attachEventOnce("renderComplete", null, removeUnitCb);
			oChart.getMeasureByName("Cost").setUnitBinding();
		}
		function removeUnitCb(oEvent) {
			var labels = [].map.call(oChart.getDomRef().querySelectorAll(".v-datalabel"), function(n) {
					return n.textContent;
				});
			var aDlDoms = [].slice.call(oChart.getDomRef().querySelectorAll(".v-datalabel"));
			assert.ok(aDlDoms.every(function(dom, index) {
				var data = dom.querySelector("text").textContent;
				return data === labels[index];
			}), "unit values are removed.");
			oChart.detachRenderComplete(removeUnitCb);
			done();
		}
	});

	QUnit.test("Properties test (ported)", function(assert) {
		var done = assert.async();
		oChart.setVizProperties({
			valueAxis: {
				title: {
					text: "123"
				}
			}
		});
		function initRenderCb(oEvent) {
			assert.equal(oChart.getChartType(), "column", "get chartType is correct");
			oChart.detachRenderComplete(initRenderCb);
			oChart.attachRenderComplete(null, setChartTypeCb);
			oChart.setChartType("line");
		}

		oChart.attachRenderComplete(null, initRenderCb);

		function setChartTypeCb(oEvent) {
			assert.equal(oChart.getChartType(), "line", "set chartType is correct");
			assert.equal(document.querySelectorAll("#qunit-fixture .v-datapoint-group .v-lines").length, 4, "chart type is switched");
			assert.equal(oChart.getVizProperties().valueAxis.title.text, "123", "get vizProperties is correct");
			oChart.detachRenderComplete(setChartTypeCb);
			oChart.attachRenderComplete(null, setVizPropertiesCb);
			oChart.setVizProperties({
				valueAxis: {
					title: {
						text: "ABC"
					}
				}
			});
		}
		function setVizPropertiesCb(oEvent) {
			assert.equal(oChart.getVizProperties().valueAxis.title.text, "ABC", "set vizProperties is correct");
			assert.equal(document.querySelector("#qunit-fixture .v-m-valueAxis .v-m-axisTitle").textContent, "ABC", "vizProperties is updated");
			oChart.detachRenderComplete(setVizPropertiesCb);
			done();
		}
	});

	QUnit.test("No data chart test",function(assert){
		var done = assert.async();
		var oModel = new JSONModel({
				"businessData": []
			});
		oChart.setModel(oModel);
		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});
		oChart.attachRenderComplete(null, setNoDataChartCb);
		function setNoDataChartCb() {
			assert.equal(this.$().find(".ui5-viz-controls-viz-description-title").text(), "No data", "No data message shows right");
			oChart.detachRenderComplete(setNoDataChartCb);
			oChart.attachRenderComplete(null, setVizPropertiesCb);
			oChart.setCustomMessages({
				"NO_DATA": "Sorry! No value!"
			});
			oChart.setVizProperties({
				valueAxis: {
					title: {
						text: "OOO"
					}
				}
			});
		}
		function setVizPropertiesCb(oEvent){
			assert.equal(this.$().find(".ui5-viz-controls-viz-description-message").text(), "Sorry! No value!", "Customized no data message still shows after setVizProperties");
			oChart.detachRenderComplete(setVizPropertiesCb);
			oChart.attachRenderComplete(null, setCorrectDataCb);
			var oModel = new JSONModel(JSONData);
			oChart.setModel(oModel);
			oChart.bindData({
				path: sResultPath,
				parameters: {
					entitySet: sResultSet,
					noPaging: true,
					useBatchRequests: true,
					provideGrandTotals: true,
					provideTotalResultSize: true
				}
			});
		}
		function setCorrectDataCb(oEvent) {
			assert.equal(oEvent.getSource(), oChart, "renderComplete event is correct");
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			assert.equal(this.$().find(".ui5-viz-controls-viz-description-title").text(), "", "No data message hides.");
			oChart.detachRenderComplete(setCorrectDataCb);
			done();
		}
	});

	QUnit.start();

});
