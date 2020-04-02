/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/makit/CombinationChart",
	"sap/makit/Category",
	"sap/makit/Layer",
	"sap/makit/Series",
	"sap/makit/Value",
	"sap/makit/Column",
	"sap/makit/library",
	"sap/makit/CategoryAxis",
	"./QUnitTestData"
], function(
	createAndAppendDiv,
	CombinationChart,
	Category,
	Layer,
	Series,
	Value,
	Column,
	makitLibrary,
	CategoryAxis,
	QUnitTestData
) {
	"use strict";

	// shortcut for sap.makit.SortOrder
	var SortOrder = sap.makit.SortOrder;

	// shortcut for sap.makit.ValueBubbleStyle
	var ValueBubbleStyle = sap.makit.ValueBubbleStyle;

	// shortcut for sap.makit.ChartType
	var ChartType = sap.makit.ChartType;


	// prepare DOM
	createAndAppendDiv("content1").setAttribute("style", "width:100%; height: 500px;");
	createAndAppendDiv("content2").setAttribute("style", "width:100%; height: 500px;");
	createAndAppendDiv("content3").setAttribute("style", "width:100%; height: 500px;");
	createAndAppendDiv("content4").setAttribute("style", "width:100%; height: 500px;");


	var dataModel = QUnitTestData.getCombiChartMSDataModel();

	//Create combination chart w/o layers
	var oChart1 = new CombinationChart("chart1", { 
		width:"100%", height:"300px",
		categoryRegions: [new Category({column: "yearCategory"})]
	}).placeAt("content1");

	QUnit.test("Combination Chart creation failure", function(assert) {
		assert.ok(document.getElementById("chart1"), "chart1 container should be rendered");
		assert.ok(!document.getElementById("chart1_graph"), "chart1_graph should be not rendered");
		assert.ok(!document.getElementById("chart1_rangeSelector"), "chart1_rangeSelector should not be rendered");

		var chart = sap.ui.getCore().byId("chart1");
		assert.ok(! chart._makitChart, "chart1._makitChart should not be initialized");
	});

	//Minimum chart initialization test w/o data
	var layer1 = new Layer({
		series : new Series({ column : "productSeries", displayName : "Product" }),
		values : [new Value({
			expression : "revenueValue", format : "currency", displayName : "Revenue"
		})]
	});
	var oChart2 = new CombinationChart("chart2", {
		width:"100%", height:"300px",
		categoryRegions: [new Category({column: "yearCategory"})],
		layers: [layer1]
	}).placeAt("content2");

	QUnit.test("Combination Chart creation succcess", function(assert) {
		assert.ok(document.getElementById("chart2"), "chart2 should be rendered");
		assert.ok(document.getElementById("chart2_graph"), "chart2_graph should be rendered");
		assert.ok(document.getElementById("chart2_rangeSelector"), "chart2_rangeSelector should be rendered");

		var chart = sap.ui.getCore().byId("chart2");
		assert.ok(chart._makitChart, "chart2._makitChart should be initialized");
	});

	//Minimum chart initialization test w/o data
	var layer1 = new Layer({
		series : new Series({ column : "productSeries", displayName : "Product" }),
		values : [new Value({
			expression : "revenueValue", format : "currency", displayName : "Revenue"
		})],
		columns: [new Column({name:"yearCategory", value:"{year}"}),
				new Column({name:"monthCategory", value:"{month}"}),
				new Column({name:"productSeries", value:"{product}"}),
				new Column({name:"revenueValue", value:"{revenue}", type:"number"})]
	});

	var layer2 = new Layer({
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

	var layer3 = new Layer({
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

	//CategoryAxis
	var catAxis = new CategoryAxis({
		showLabel:true,
		showPrimaryLine:true,
		showGrid:false,
		thickness:1.5,
	});

	var oChart3 = new CombinationChart("chart3", {
		width:"100%", height:"300px",
		categoryRegions: [new Category({column: "yearCategory", displayName : "Year", format:"number"}), new Category({column: "monthCategory", displayName: "Month"})],
		categoryAxis:catAxis,
		layers: [layer1, layer2, layer3]
	}).placeAt("content3");

	QUnit.test("Combination Chart creation succcess", function(assert) {
		assert.ok(document.getElementById("chart3"), "chart3 should be rendered");
		assert.ok(document.getElementById("chart3_graph"), "chart3_graph should be rendered");
		assert.ok(document.getElementById("chart3_rangeSelector"), "chart3_rangeSelector should be rendered");

		var chart = sap.ui.getCore().byId("chart3");
		assert.ok(chart._makitChart, "chart3._makitChart should be initialized");
	});

	QUnit.test("Chart data populated", function(assert) {
		var expectedRowsLenNoData = 0; //Expected rows count for chart with no binding
		var expectedRowsLenWithData = 396; //Expected rows count for chart with binding on creation

		var chart3 = sap.ui.getCore().byId("chart3");
		var layers = chart3.getLayers();
		assert.deepEqual(layers[0]._datarows.length, expectedRowsLenWithData, "layer1._datarows.length should now be "+expectedRowsLenWithData);
		assert.deepEqual(layers[1]._datarows.length, expectedRowsLenWithData, "layer2._datarows.length should now be "+expectedRowsLenWithData);
		assert.deepEqual(layers[2]._datarows.length, expectedRowsLenWithData, "layer3._datarows.length should now be "+expectedRowsLenWithData);				
	});

	QUnit.test("Chart range selector test", function(assert) {
		var expectedRowsLenNoData = 0; //Expected rows count for chart with no binding
		var expectedRowsLenWithData = 396; //Expected rows count for chart with binding on creation

		var chart3 = sap.ui.getCore().byId("chart3");
		var layers = chart3.getLayers();

		//Range selector visibility test
		assert.deepEqual(chart3._makitChart.isRangeSelectorViewVisible(), true, "chart3 range selector should be visible");
		chart3.setShowRangeSelector(false);
		assert.deepEqual(chart3._makitChart.isRangeSelectorViewVisible(), false, "chart3 range selector should not be visible anymore");
	});

	QUnit.test("Chart value bubble testing", function(assert) {
		var chart3 = sap.ui.getCore().byId("chart3");
		var vb = chart3.getValueBubble();
		var styleObj = chart3._makitChart.getValueBubbleStyle();
		var sapStyleObj = vb.toObject();
		assert.deepEqual(styleObj.style, sapStyleObj.style, "_makitChart ValueBubble style should be set");
		assert.deepEqual(styleObj.position, sapStyleObj.position, "_makitChart ValueBubble position should be set");
		assert.deepEqual(styleObj.showCategoryText, sapStyleObj.showCategoryText, "_makitChart ValueBubble showCategoryText should be set");
		assert.deepEqual(styleObj.showCategoryDisplayName, sapStyleObj.showCategoryDisplayName, "_makitChart ValueBubble showCategoryDisplayName should be set");
		assert.deepEqual(styleObj.showValueDisplayName, sapStyleObj.showValueDisplayName, "_makitChart ValueBubble showValueDisplayName should be set");
		assert.deepEqual(styleObj.showValueOnPieChart, sapStyleObj.showValueOnPieChart, "_makitChart ValueBubble showValueOnPieChart should be set");
		assert.deepEqual(styleObj.showLegendLabel, sapStyleObj.showLegendLabel, "_makitChart ValueBubble showLegendLabel should be set");
		assert.deepEqual(styleObj.showNullValue, sapStyleObj.showNullValue, "_makitChart ValueBubble showNullValue should be set");

		vb.setStyle(vb.getStyle() === ValueBubbleStyle.Top? ValueBubbleStyle.FloatTop : ValueBubbleStyle.Top);

		styleObj = chart3._makitChart.getValueBubbleStyle();
		sapStyleObj = vb.toObject();
		assert.deepEqual(styleObj.style, sapStyleObj.style, "_makitChart ValueBubble style should be set");
		assert.deepEqual(styleObj.position, sapStyleObj.position, "_makitChart ValueBubble position should be set");
		assert.deepEqual(styleObj.showCategoryText, sapStyleObj.showCategoryText, "_makitChart ValueBubble showCategoryText should be set");
		assert.deepEqual(styleObj.showCategoryDisplayName, sapStyleObj.showCategoryDisplayName, "_makitChart ValueBubble showCategoryDisplayName should be set");
		assert.deepEqual(styleObj.showValueDisplayName, sapStyleObj.showValueDisplayName, "_makitChart ValueBubble showValueDisplayName should be set");
		assert.deepEqual(styleObj.showValueOnPieChart, sapStyleObj.showValueOnPieChart, "_makitChart ValueBubble showValueOnPieChart should be set");
		assert.deepEqual(styleObj.showLegendLabel, sapStyleObj.showLegendLabel, "_makitChart ValueBubble showLegendLabel should be set");
		assert.deepEqual(styleObj.showNullValue, sapStyleObj.showNullValue, "_makitChart ValueBubble showNullValue should be set");
	});

	QUnit.test("Chart category testing", function(assert) {
		var chart3 = sap.ui.getCore().byId("chart3");
		assert.deepEqual(chart3._makitChart.getProperty("categories[0].column"), "yearCategory", "_makitChart column should be yearCategory");
		assert.deepEqual(chart3._makitChart.getProperty("categories[0].format"), "number", "_makitChart column should be number");
		assert.deepEqual(chart3._makitChart.getProperty("categories[1].column"), "monthCategory", "_makitChart column should be monthCategory");
		//displayname of all categories should be combined into the first category's displayname
		assert.deepEqual(chart3._makitChart.getProperty("categories[0].displayName"), "Month | Year", "_makitChart column should be Month | Year");
	});

	QUnit.test("Chart primary axis testing", function(assert) {
		var chart3 = sap.ui.getCore().byId("chart3");
		assert.deepEqual(chart3._makitChart.getProperty("primaryaxis.values.min"), undefined, "_makitChart primary value axis showlabel should be undefined");
		assert.deepEqual(chart3._makitChart.getProperty("primaryaxis.values.max"), undefined, "_makitChart primary value axis showlabel should be undefined");
		assert.deepEqual(chart3._makitChart.getProperty("primaryaxis.values.showlabel"), true, "_makitChart primary value axis showlabel should be true");
		assert.deepEqual(chart3._makitChart.getProperty("primaryaxis.values.showprimaryline"), false, "_makitChart primary value axis showprimaryline should be false");
		assert.deepEqual(chart3._makitChart.getProperty("primaryaxis.values.showgrid"), true, "_makitChart primary value axis showgrid should be true");
		assert.deepEqual(chart3._makitChart.getProperty("primaryaxis.values.thickness"), 1, "_makitChart primary value axis thickness should be 1");
		assert.deepEqual(chart3._makitChart.getProperty("primaryaxis.values.color"), "gray", "_makitChart primary value axis color should be gray");

		var primValueAxis = chart3.getPrimaryValueAxis();
		primValueAxis.setMin(10);
		primValueAxis.setMax(1000000);
		primValueAxis.setShowLabel(false);
		primValueAxis.setShowPrimaryLine(true);
		primValueAxis.setShowGrid(false);
		primValueAxis.setThickness(2);
		primValueAxis.setColor("green");
		assert.deepEqual(chart3._makitChart.getProperty("primaryaxis.values.min"), 10, "_makitChart primary value axis min should be 10");
		assert.deepEqual(chart3._makitChart.getProperty("primaryaxis.values.max"), 1000000, "_makitChart primary value axis max should be 1000000");
		assert.deepEqual(chart3._makitChart.getProperty("primaryaxis.values.showlabel"), false, "_makitChart primary value axis showlabel should be false");
		assert.deepEqual(chart3._makitChart.getProperty("primaryaxis.values.showprimaryline"), true, "_makitChart primary value axis showprimaryline should be true");
		assert.deepEqual(chart3._makitChart.getProperty("primaryaxis.values.showgrid"), false, "_makitChart primary value axis showgrid should be false");
		assert.deepEqual(chart3._makitChart.getProperty("primaryaxis.values.thickness"), 2, "_makitChart primary value axis thickness should be 1");
		assert.deepEqual(chart3._makitChart.getProperty("primaryaxis.values.color"), "green", "_makitChart primary value axis color should be green");

	});

	QUnit.test("Chart secondary axis testing", function(assert) {
		var chart3 = sap.ui.getCore().byId("chart3");
		assert.deepEqual(chart3._makitChart.getProperty("secondaryaxis.values.min"), undefined, "_makitChart secondary value axis min should be undefined");
		assert.deepEqual(chart3._makitChart.getProperty("secondaryaxis.values.max"), undefined, "_makitChart secondary value axis max should be undefined");
		assert.deepEqual(chart3._makitChart.getProperty("secondaryaxis.values.showlabel"), true, "_makitChart secondary value axis showlabel should be true");
		assert.deepEqual(chart3._makitChart.getProperty("secondaryaxis.values.showprimaryline"), false, "_makitChart secondary value axis showprimaryline should be false");
		assert.deepEqual(chart3._makitChart.getProperty("secondaryaxis.values.showgrid"), true, "_makitChart secondary value axis showgrid should be true");
		assert.deepEqual(chart3._makitChart.getProperty("secondaryaxis.values.thickness"), 1, "_makitChart secondary value axis thickness should be 1");
		assert.deepEqual(chart3._makitChart.getProperty("secondaryaxis.values.color"), "gray", "_makitChart secondary value axis color should be gray");

		var secondaryValueAxis = chart3.getSecondaryValueAxis();
		secondaryValueAxis.setMin(10);
		secondaryValueAxis.setMax(1000000);
		secondaryValueAxis.setShowLabel(false);
		secondaryValueAxis.setShowPrimaryLine(true);
		secondaryValueAxis.setShowGrid(false);
		secondaryValueAxis.setThickness(2);
		secondaryValueAxis.setColor("green");
		assert.deepEqual(chart3._makitChart.getProperty("secondaryaxis.values.min"), 10, "_makitChart secondary value axis showlabel should be 10");
		assert.deepEqual(chart3._makitChart.getProperty("secondaryaxis.values.max"), 1000000, "_makitChart secondary value axis showlabel should be 1000000");
		assert.deepEqual(chart3._makitChart.getProperty("secondaryaxis.values.showlabel"), false, "_makitChart secondary value axis showlabel should be false");
		assert.deepEqual(chart3._makitChart.getProperty("secondaryaxis.values.showprimaryline"), true, "_makitChart secondary value axis showprimaryline should be true");
		assert.deepEqual(chart3._makitChart.getProperty("secondaryaxis.values.showgrid"), false, "_makitChart secondary value axis showgrid should be false");
		assert.deepEqual(chart3._makitChart.getProperty("secondaryaxis.values.thickness"), 2, "_makitChart secondary value axis thickness should be 1");
		assert.deepEqual(chart3._makitChart.getProperty("secondaryaxis.values.color"), "green", "_makitChart secondary value axis color should be green");

	});

	QUnit.test("Chart category axis testing", function(assert) {
		var chart3 = sap.ui.getCore().byId("chart3");
		assert.deepEqual(chart3._makitChart.getProperty("category.sortorder"), "none", "_makitChart category axis sortorder should be none");
		assert.deepEqual(chart3._makitChart.getProperty("category.displayLastLabel"), false, "_makitChart category axis displaylastlabel should be false");
		assert.deepEqual(chart3._makitChart.getProperty("categories.display"), "true", "_makitChart category axis displayall should be true");
		assert.deepEqual(chart3._makitChart.getProperty("category.showlabel"), true, "_makitChart category axis showlabel should be true");
		assert.deepEqual(chart3._makitChart.getProperty("category.showprimaryline"), true, "_makitChart category axis showprimaryline should be true");
		assert.deepEqual(chart3._makitChart.getProperty("category.showgrid"), false, "_makitChart category axis showgrid should be false");
		assert.deepEqual(chart3._makitChart.getProperty("category.thickness"), 1.5, "_makitChart category axis thickness should be 1.5");
		assert.deepEqual(chart3._makitChart.getProperty("category.color"), "gray", "_makitChart category axis color should be gray");

		//Switch them
		var categoryAxis = chart3.getCategoryAxis();
		categoryAxis.setSortOrder(SortOrder.Descending);
		categoryAxis.setDisplayLastLabel(true);
		categoryAxis.setDisplayAll(false);
		categoryAxis.setShowLabel(false);
		categoryAxis.setShowPrimaryLine(false);
		categoryAxis.setShowGrid(true);
		categoryAxis.setThickness(2);
		categoryAxis.setColor("green");
		assert.deepEqual(chart3._makitChart.getProperty("category.sortorder"), "descending", "_makitChart category axis sortorder should be descending");
		assert.deepEqual(chart3._makitChart.getProperty("category.displayLastLabel"), true, "_makitChart category axis displaylastlabel should be true");
		assert.deepEqual(chart3._makitChart.getProperty("categories.display"), "", "_makitChart category axis displayall should be empty");
		assert.deepEqual(chart3._makitChart.getProperty("category.showlabel"), false, "_makitChart category axis showlabel should be false");
		assert.deepEqual(chart3._makitChart.getProperty("category.showprimaryline"), false, "_makitChart category axis showprimaryline should be false");
		assert.deepEqual(chart3._makitChart.getProperty("category.showgrid"), true, "_makitChart category axis showgrid should be true");
		assert.deepEqual(chart3._makitChart.getProperty("category.thickness"), 2, "_makitChart category axis thickness should be 1");
		assert.deepEqual(chart3._makitChart.getProperty("category.color"), "green", "_makitChart category axis color should be green");
	});
});