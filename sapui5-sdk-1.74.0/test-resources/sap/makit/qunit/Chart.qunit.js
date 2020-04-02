/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/makit/Chart",
	"sap/makit/Value",
	"sap/makit/Category",
	"sap/makit/Series",
	"sap/makit/Column",
	"sap/makit/library",
	"sap/makit/ValueAxis",
	"sap/makit/CategoryAxis",
	"sap/makit/ValueBubble",
	"./QUnitTestData"
], function(
	createAndAppendDiv,
	Chart,
	Value,
	Category,
	Series,
	Column,
	makitLibrary,
	ValueAxis,
	CategoryAxis,
	ValueBubble,
	QUnitTestData
) {
	"use strict";

	// shortcut for sap.makit.ValueBubblePosition
	var ValueBubblePosition = sap.makit.ValueBubblePosition;

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


	var model = QUnitTestData.getMultiSeriesJSONDataModel();

	//Minimum chart initialization test w/o data
	var oChart1 = new Chart("chart1", { 
		values: [new Value({expression: "revenueValue"})],
		category: new Category({column: "yearCategory"})
	}).placeAt("content1");


	//Minimum chart initialization test with data
	var oChart2 = new Chart("chart2", { 
		values: [new Value({ expression: "revenueValue" })],
		category: new Category({ column: "yearCategory" }),
		series : new Series({ column : "productSeries" }),
		columns: [
				new Column({name:"yearCategory", value:"{year}"}),
				new Column({name:"productSeries", value:"{product}"}),
				new Column({name:"revenueValue", value:"{revenue}", type:"number"})
		],
		rows: { path:"/mydata"}
	}).placeAt("content2");
	oChart2.setModel(model);

	//Maximum chart initialization test
	var oChart3 = new Chart("chart3",{
		width : "80%",
		height : "80%",
		type : ChartType.Line,
		showRangeSelector : false,
		showTableView : false,
		valueAxis : new ValueAxis({}),
		categoryAxis : new CategoryAxis({}),
		category : new Category({
			column : "yearCategory",
			displayName : "The Year",
		}),
		series : new Series({
			column : "productSeries",
			displayName : "Product",
		}),
		values : [new Value({
			expression : "revenueValue",
			format : "currency",
			displayName : "Revenue",
		})],
		valueBubble : new ValueBubble({
			style: ValueBubbleStyle.FloatTop,
			showCategoryText: false
		}),
	}).placeAt("content3");

	oChart3.addColumn(new Column({name:"yearCategory", value:"{year}"}));
	oChart3.addColumn(new Column({name:"productSeries", value:"{product}"}));
	oChart3.addColumn(new Column({name:"revenueValue", value:"{revenue}", type:"number"}));
	oChart3.addColumn(new Column({name:"costValue", value:"{cost}", type:"number"}));
	oChart3.bindRows("/mydata");
	oChart3.setModel(model);

	QUnit.test("Chart initialized", function(assert) {
		assert.ok(document.getElementById("chart1"), "chart1 should be rendered");
		assert.ok(document.getElementById("chart1_graph"), "chart1_graph should be rendered");
		assert.ok(document.getElementById("chart1_rangeSelector"), "chart1_rangeSelector should be rendered");
		assert.ok(document.getElementById("chart2"), "chart2 should be rendered");
		assert.ok(document.getElementById("chart3"), "chart3 should be rendered");

		var chart1 = sap.ui.getCore().byId("chart1");
		assert.ok(chart1._makitChart, "chart1._makitChart should be initialized");
		var chart2 = sap.ui.getCore().byId("chart2");
		assert.ok(chart2._makitChart, "chart2._makitChart should be initialized");
		var chart3 = sap.ui.getCore().byId("chart3");
		assert.ok(chart3._makitChart, "chart3._makitChart should be initialized");
	});

	QUnit.test("Chart size testing", function(assert) {
		var chart1 = sap.ui.getCore().byId("chart1");
		var chart1ParentDOM = document.getElementById(chart1.getParent().getId());
		var chart1DOM = document.getElementById("chart1");
		assert.deepEqual(chart1DOM.offsetHeight, chart1ParentDOM.offsetHeight, "chart1's height should be "+ chart1ParentDOM.offsetHeight);

		var chart2 = sap.ui.getCore().byId("chart2");

		var chart3 = sap.ui.getCore().byId("chart3");
		var chart3ParentDOM = document.getElementById(chart3.getParent().getId());
		var expectedHeight = Math.ceil(chart3ParentDOM.offsetHeight * 0.8);

		var chart3DOM = document.getElementById("chart3");
		assert.deepEqual(chart3DOM.offsetHeight, expectedHeight, "chart3's height should be "+ expectedHeight);
	});

	QUnit.test("Chart data populated", function(assert) {
		var expectedRowsLenNoData = 0; //Expected rows count for chart with no binding
		var expectedRowsLenWithData = 6; //Expected rows count for chart with binding on creation

		var chart1 = sap.ui.getCore().byId("chart1");
		assert.deepEqual(chart1._datarows.length, expectedRowsLenNoData, "chart1._datarows.length should now be "+expectedRowsLenNoData);

		var chart2 = sap.ui.getCore().byId("chart2");
		assert.deepEqual(chart2._datarows.length, expectedRowsLenWithData, "chart2._datarows.length should now be "+expectedRowsLenWithData);

		var chart3 = sap.ui.getCore().byId("chart3");
		assert.deepEqual(chart3._datarows.length, expectedRowsLenWithData, "chart3._datarows.length should now be "+expectedRowsLenWithData);				
	});

	QUnit.test("Chart default property value", function(assert) {
		var chart1 = sap.ui.getCore().byId("chart1");
		assert.deepEqual(chart1.getType().toLowerCase(), chart1._makitChart.getProperty("charttype"), "_makitChart charttype should be set (lowercase expected)");
		assert.deepEqual(chart1.getShowTableView(), chart1._makitChart.isTableViewVisible(), "chart1 showTableView should be false");
		assert.deepEqual(chart1.getShowRangeSelector(), chart1._makitChart.isRangeSelectorViewVisible(), "chart1 showRangeSelector should be false");

		var chartCategoryAxis = chart1.getCategoryAxis();
		assert.ok(chartCategoryAxis instanceof CategoryAxis, "chart1 categoryAxis property should be of sap.makit.CategoryAxis type");
		assert.deepEqual(chartCategoryAxis.getShowLabel(), chart1._makitChart.getProperty("category.showlabel"), "_makitChart category.showlabel default value should be set");
		assert.deepEqual(chartCategoryAxis.getShowPrimaryLine(), chart1._makitChart.getProperty("category.showprimaryline"), "_makitChart category.showprimaryline should be set");
		assert.deepEqual(chartCategoryAxis.getShowGrid(), chart1._makitChart.getProperty("category.showgrid"), "_makitChart category.showGrid should be set");
		assert.deepEqual(chartCategoryAxis.getThickness(), chart1._makitChart.getProperty("category.thickness"), "_makitChart category.thickness should be set");
		assert.deepEqual(chartCategoryAxis.getSortOrder().toLowerCase(), chart1._makitChart.getProperty("category.sortorder"), "_makitChart category.sortorder should be set (lowercase expected)");
		assert.deepEqual(chartCategoryAxis.getDisplayLastLabel(), chart1._makitChart.getProperty("category.displaylastlabel"), "_makitChart category.displaylastlabel should be set");

		var chartValueAxis = chart1.getValueAxis();
		assert.ok(chartValueAxis instanceof ValueAxis, "chart1 categoryAxis property should be of sap.makit.ValueAxis type");
		assert.deepEqual(chartValueAxis.getShowLabel(), chart1._makitChart.getProperty("values.showlabel"), "_makitChart values.showlabel default value should be set");
		assert.deepEqual(chartValueAxis.getShowPrimaryLine(), chart1._makitChart.getProperty("values.showprimaryline"), "_makitChart values.showprimaryline should be set");
		assert.deepEqual(chartValueAxis.getShowGrid(), chart1._makitChart.getProperty("values.showgrid"), "_makitChart values.showGrid should be set");
		assert.deepEqual(chartValueAxis.getThickness(), chart1._makitChart.getProperty("values.thickness"), "_makitChart values.thickness should be set");

		//Now change the default value
		chart1.setShowTableView(!chart1.getShowTableView());
		chart1.setShowRangeSelector(!chart1.getShowRangeSelector());

		chartCategoryAxis.setShowLabel(!chartCategoryAxis.getShowLabel());
		chartCategoryAxis.setShowPrimaryLine(!chartCategoryAxis.getShowPrimaryLine());
		chartCategoryAxis.setShowGrid(!chartCategoryAxis.getShowGrid());
		chartCategoryAxis.setThickness(chartCategoryAxis.getThickness() == 0.5? 1.0 : 0.5);
		chartCategoryAxis.setSortOrder(chartCategoryAxis.getSortOrder() == SortOrder.Ascending? SortOrder.Descending : SortOrder.Ascending);
		chartCategoryAxis.setDisplayLastLabel(!chartCategoryAxis.getDisplayLastLabel());

		chartValueAxis.setShowLabel(!chartCategoryAxis.getShowLabel());
		chartValueAxis.setShowPrimaryLine(!chartCategoryAxis.getShowPrimaryLine());
		chartValueAxis.setShowGrid(!chartCategoryAxis.getShowGrid());
		chartValueAxis.setThickness(chartCategoryAxis.getThickness() == 0.5? 1.0 : 0.5);

		//Check that the default value has changed
		assert.deepEqual(chart1.getShowTableView(), chart1._makitChart.isTableViewVisible(), "chart1 showTableView should be false");
		assert.deepEqual(chart1.getShowRangeSelector(), chart1._makitChart.isRangeSelectorViewVisible(), "chart1 showRangeSelector should be false");

		assert.deepEqual(chartCategoryAxis.getShowLabel(), chart1._makitChart.getProperty("category.showlabel"), "_makitChart category.showlabel default value should be set");
		assert.deepEqual(chartCategoryAxis.getShowPrimaryLine(), chart1._makitChart.getProperty("category.showprimaryline"), "_makitChart category.showprimaryline should be set");
		assert.deepEqual(chartCategoryAxis.getShowGrid(), chart1._makitChart.getProperty("category.showgrid"), "_makitChart category.showGrid should be set");
		assert.deepEqual(chartCategoryAxis.getThickness(), chart1._makitChart.getProperty("category.thickness"), "_makitChart category.thickness should be set");
		assert.deepEqual(chartCategoryAxis.getSortOrder().toLowerCase(), chart1._makitChart.getProperty("category.sortorder"), "_makitChart category.sortorder should be set (lowercase expected)");
		assert.deepEqual(chartCategoryAxis.getDisplayLastLabel(), chart1._makitChart.getProperty("category.displaylastlabel"), "_makitChart category.displaylastlabel should be set");

		assert.deepEqual(chartValueAxis.getShowLabel(), chart1._makitChart.getProperty("values.showlabel"), "_makitChart values.showlabel default value should be set");
		assert.deepEqual(chartValueAxis.getShowPrimaryLine(), chart1._makitChart.getProperty("values.showprimaryline"), "_makitChart values.showprimaryline should be set");
		assert.deepEqual(chartValueAxis.getShowGrid(), chart1._makitChart.getProperty("values.showgrid"), "_makitChart values.showGrid should be set");
		assert.deepEqual(chartValueAxis.getThickness(), chart1._makitChart.getProperty("values.thickness"), "_makitChart values.thickness should be set");

	});


	QUnit.test("Chart set chart type", function(assert) {
		var chart1 = sap.ui.getCore().byId("chart1");
		chart1.setType(ChartType.Line);
		assert.deepEqual(chart1._makitChart.getProperty("charttype"), ChartType.Line.toLowerCase() , "_makitChart charttype should be changed (lowercase expected)");
		chart1.setType(ChartType.Bar);
		assert.deepEqual(chart1._makitChart.getProperty("charttype"), ChartType.Bar.toLowerCase() , "_makitChart charttype should be changed (lowercase expected)");
		chart1.setType(ChartType.Bubble);
		assert.deepEqual(chart1._makitChart.getProperty("charttype"), ChartType.Bubble.toLowerCase() , "_makitChart charttype should be changed (lowercase expected)");
		chart1.setType(ChartType.Pie);
		assert.deepEqual(chart1._makitChart.getProperty("charttype"), ChartType.Pie.toLowerCase() , "_makitChart charttype should be changed (lowercase expected)");
		assert.deepEqual(chart1._makitChart.getProperty("piestyle"), ChartType.Pie.toLowerCase() , "_makitChart piestyle should be changed (lowercase expected)");
		chart1.setType(ChartType.Donut);
		assert.deepEqual(chart1._makitChart.getProperty("charttype"), ChartType.Pie.toLowerCase() , "_makitChart charttype should be changed (lowercase expected)");
		assert.deepEqual(chart1._makitChart.getProperty("piestyle"), ChartType.Donut.toLowerCase() , "_makitChart piestyle should be changed (lowercase expected)");
		chart1.setType(ChartType.Column);
	});

	QUnit.test("Chart value bubble testing", function(assert) {
		var chart2 = sap.ui.getCore().byId("chart2");
		var vb = chart2.getValueBubble();
		var styleObj = chart2._makitChart.getValueBubbleStyle();
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
		//vb.setShowCategoryText(!vb.getShowCategoryText());
		//vb.setShowCategoryDisplayName(!vb.getShowCategoryDisplayName());
		//vb.setShowValueDisplayName(!vb.getShowValueDisplayName());
		//vb.setShowValueOnPieChart(!vb.getShowValueOnPieChart());
		//vb.setShowLegendLabel(!vb.getShowLegendLabel());
		//vb.setShowNullValue(!vb.getShowNullValue());
		chart2.setType(ChartType.Donut);
		vb.setPosition(vb.getPosition() === ValueBubblePosition.Top? ValueBubblePosition.Side : ValueBubblePosition.Top);

		styleObj = chart2._makitChart.getValueBubbleStyle();
		sapStyleObj = vb.toObject();
		assert.deepEqual(styleObj.style, sapStyleObj.style, "_makitChart ValueBubble style should be set");
		assert.deepEqual(styleObj.position, sapStyleObj.position, "_makitChart ValueBubble position should be set");
		assert.deepEqual(styleObj.showCategoryText, sapStyleObj.showCategoryText, "_makitChart ValueBubble showCategoryText should be set");
		assert.deepEqual(styleObj.showCategoryDisplayName, sapStyleObj.showCategoryDisplayName, "_makitChart ValueBubble showCategoryDisplayName should be set");
		assert.deepEqual(styleObj.showValueDisplayName, sapStyleObj.showValueDisplayName, "_makitChart ValueBubble showValueDisplayName should be set");
		assert.deepEqual(styleObj.showValueOnPieChart, sapStyleObj.showValueOnPieChart, "_makitChart ValueBubble showValueOnPieChart should be set");
		assert.deepEqual(styleObj.showLegendLabel, sapStyleObj.showLegendLabel, "_makitChart ValueBubble showLegendLabel should be set");
		assert.deepEqual(styleObj.showNullValue, sapStyleObj.showNullValue, "_makitChart ValueBubble showNullValue should be set");
		chart2.setType(ChartType.Column);
	});

	/*
	*	Test for data binding after the chart has been created
	*/
	QUnit.test("Chart data binding testing", function(assert) {
		var rowsLenBeforeBinding = 0; //Expected rows count before data binding
		var rowsLenAfterBinding = 3; //Expected rows count after data binding
		var rowsLenAfterAdd = 5; //Expected rows count after adding new data rows to the data source
		var rowsLenAfterDelete = 4; //Expected rows count after deleting 1 data rows from the data source

		var chart1 = sap.ui.getCore().byId("chart1");
		assert.deepEqual(chart1._datarows.length, rowsLenBeforeBinding, "chart1._datarows.length before binding should be "+rowsLenBeforeBinding);
		chart1.addColumn(new Column({name:"yearCategory", value:"{year}"}));
		chart1.addColumn(new Column({name:"revenueValue", value:"{revenue}", type:"number"}));
		chart1.addColumn(new Column({name:"costValue", value:"{cost}", type:"number"}));
		var model = QUnitTestData.getSingleSeriesJSONDataModel();
		chart1.setModel(model);
		chart1.bindRows("/mydata");
		assert.deepEqual(chart1._datarows.length, rowsLenAfterBinding, "chart1._datarows.length after binding should be "+rowsLenAfterBinding);
		var newData1 = { year : 2011, revenue : 10000000, cost : 8000000 };
		var newData2 = { year : 2012, revenue : 9000000, cost : 7600000 };
		model.getProperty("/mydata").push(newData1);
		model.getProperty("/mydata").push(newData2);
		chart1.getModel().checkUpdate();
		assert.deepEqual(chart1._datarows.length, rowsLenAfterAdd, "chart1._datarows.length after adding 2 new rows should be "+rowsLenAfterAdd);

		model.getProperty("/mydata").pop();
		chart1.getModel().checkUpdate();
		assert.deepEqual(chart1._datarows.length, rowsLenAfterDelete, "chart1._datarows.length after deleting 1 row should be "+rowsLenAfterDelete);
	});
});