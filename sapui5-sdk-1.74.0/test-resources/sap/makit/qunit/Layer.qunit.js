/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/makit/Layer",
	"sap/makit/library",
	"sap/makit/Series",
	"sap/makit/Value",
	"sap/makit/Column",
	"sap/makit/CombinationChart",
	"sap/makit/Category",
	"sap/makit/CategoryAxis",
	"./QUnitTestData"
], function(
	createAndAppendDiv,
	Layer,
	makitLibrary,
	Series,
	Value,
	Column,
	CombinationChart,
	Category,
	CategoryAxis,
	QUnitTestData
) {
	"use strict";

	// shortcut for sap.makit.ChartType
	var ChartType = sap.makit.ChartType;


	// prepare DOM
	createAndAppendDiv("content1").setAttribute("style", "width:100%; height: 500px;");
	createAndAppendDiv("content2").setAttribute("style", "width:100%; height: 500px;");
	createAndAppendDiv("content3").setAttribute("style", "width:100%; height: 500px;");
	createAndAppendDiv("content4").setAttribute("style", "width:100%; height: 500px;");


	var dataModel = QUnitTestData.getCombiChartMSDataModel();

	//Minimum chart initialization test w/o data
	var layer1 = new Layer("layer1", {
		type: ChartType.Bar,
		series : new Series({ column : "productSeries", displayName : "Product" }),
		values : [new Value({
			expression : "revenueValue", format : "currency", displayName : "Revenue"
		})],
		columns: [new Column({name:"yearCategory", value:"{year}"}),
				new Column({name:"monthCategory", value:"{month}"}),
				new Column({name:"productSeries", value:"{product}"}),
				new Column({name:"revenueValue", value:"{revenue}", type:"number"})]
	});

	var layer2 = new Layer("layer2", {
		type: ChartType.Line,
		drawOnSecondaryAxis: true,
		series : new Series({ column : "productSeries", displayName : "Product" }),
		values : [new Value({
			expression : "costValue", format : "currency", displayName : "Revenue"
		})],
		columns: [new Column({name:"yearCategory", value:"{year}"}),
				new Column({name:"monthCategory", value:"{month}"}),
				new Column({name:"productSeries", value:"{product}"}),
				new Column({name:"costValue", value:"{cost}", type:"number"})],
	});

	var layer3 = new Layer("layer3", {
		type: ChartType.Line,
		series : new Series({ column : "productSeries", displayName : "Product" }),
		values : [new Value({
			expression : "revenueValue-costValue", format : "currency", displayName : "Revenue"
		})],
		columns: [new Column({name:"yearCategory", value:"{year}"}),
				new Column({name:"monthCategory", value:"{month}"}),
				new Column({name:"productSeries", value:"{product}"}),
				new Column({name:"revenueValue", value:"{revenue}", type:"number"}),
				new Column({name:"costValue", value:"{cost}", type:"number"})],
	});

	layer1.setModel(dataModel);
	layer1.bindRows("/mydata");
	layer2.setModel(dataModel);
	layer2.bindRows("/mydata");
	layer3.setModel(dataModel);
	layer3.bindRows("/mydata");
	var oChart1 = new CombinationChart("chart1", {
		width:"100%", height:"300px",
		categoryRegions: [new Category({column: "yearCategory"}), new Category({column: "monthCategory"})],
		categoryAxis: new CategoryAxis({displayLastLabel:true}),
		layers: [layer1, layer2, layer3]
	}).placeAt("content1");

	//This test is to test the interal auto switch of chart type from line to verticalline type 
	QUnit.test("Layer type test", function(assert) {

		var expectedLayer1Type = "bar"; 
		var expectedLayer2Type = "verticalline";
		var expectedLayer3Type = "verticalline";

		var chart = sap.ui.getCore().byId("chart1");
		var layers = chart.getLayers();
		assert.deepEqual(chart._makitChart.getProperty("layer1.charttype"), expectedLayer1Type, "layer1 chart type " + expectedLayer1Type);
		assert.deepEqual(chart._makitChart.getProperty("layer2.charttype"), expectedLayer2Type, "layer2 chart type " + expectedLayer2Type);
		assert.deepEqual(chart._makitChart.getProperty("layer3.charttype"), expectedLayer3Type, "layer3 chart type " + expectedLayer3Type);

		// Now set the type to column, it should switch the type to line
		layers[0].setType(ChartType.Column);
		var expectedLayer1Type = "column"; 
		var expectedLayer2Type = "line";
		var expectedLayer3Type = "line";

		assert.deepEqual(chart._makitChart.getProperty("layer1.charttype"), expectedLayer1Type, "layer1 chart type " + expectedLayer1Type);
		assert.deepEqual(chart._makitChart.getProperty("layer2.charttype"), expectedLayer2Type, "layer2 chart type " + expectedLayer2Type);
		assert.deepEqual(chart._makitChart.getProperty("layer3.charttype"), expectedLayer3Type, "layer3 chart type " + expectedLayer3Type);
	});

	QUnit.test("Layer property test", function(assert) {
		var chart = sap.ui.getCore().byId("chart1");
		assert.deepEqual(chart._makitChart.getProperty("layer1.values.secondaryaxis"), false, "layer1 should not be on secondary value axis");
		assert.deepEqual(chart._makitChart.getProperty("layer2.values.secondaryaxis"), true, "layer2 should be on secondary value axis");
		assert.deepEqual(chart._makitChart.getProperty("layer3.values.secondaryaxis"), false, "layer3 should not be on secondary value axis");

		// Now set the switch some layer to different value axis
		var layers = chart.getLayers();
		layers[0].setDrawOnSecondaryAxis(true);
		layers[1].setDrawOnSecondaryAxis(false);

		assert.deepEqual(chart._makitChart.getProperty("layer1.values.secondaryaxis"), true, "layer1 should be on secondary axis");
		assert.deepEqual(chart._makitChart.getProperty("layer2.values.secondaryaxis"), false, "layer2 should not be on secondary axis");
		assert.deepEqual(chart._makitChart.getProperty("layer3.values.secondaryaxis"), false, "layer3 should not be on secondary axis");

	});
});