sap.ui.define([
	"sap/suite/ui/commons/ChartContainer",
	"sap/suite/ui/commons/ChartContainerContent",
	"sap/viz/ui5/controls/VizFrame",
	"sap/m/Table",
	"sap/ui/base/Event"
], function(ChartContainer, ChartContainerContent, VizFrame, Table, Event) {
	"use strict";

	QUnit.module("Lifecycle for SelectionDetails", {
		beforeEach : function() {
			this.oChartContainer = new ChartContainer();
			this.oChartContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.module("Default values", {
		beforeEach: function() {
			this.oChartContainer = new ChartContainer();
		},
		afterEach: function() {
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.test("Default value of property showSelectionDetails", function(assert) {
		assert.equal(this.oChartContainer.getShowSelectionDetails(), false, "Default value is correct.");
	});

	QUnit.module("Rendering in Toolbar", {
		beforeEach: function() {
			this.oChartContainer = new ChartContainer();
			this.oVizFrame = new VizFrame();
			this.oChartContent = new ChartContainerContent({
				content: this.oVizFrame
			});
			this.oTableContent = new ChartContainerContent({
				content: new Table()
			});
			this.oChartContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.test("SelectionDetails is contained in toolbar, if showSelectionDetails is true", function(assert) {
		//Arrange
		var oSelectionDetails = this.oChartContent._oSelectionDetails;
		var oToolbar = this.oChartContainer.getToolbar();
		//Act
		this.oChartContainer.setShowSelectionDetails(true);
		this.oChartContainer.addContent(this.oChartContent);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(oToolbar.getContent().indexOf(oSelectionDetails) > -1, "showSelectionDetails is true : button is in toolbar");
	});

	QUnit.test("SelectionDetails is not contained in toolbar, if showSelectionDetails is false", function(assert) {
		//Arrange
		var oSelectionDetails = this.oChartContent._oSelectionDetails;
		var oToolbar = this.oChartContainer.getToolbar();
		//Act
		this.oChartContainer.setShowSelectionDetails(true);
		this.oChartContainer.addContent(this.oChartContent);
		sap.ui.getCore().applyChanges();
		this.oChartContainer.setShowSelectionDetails(false);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(oToolbar.getContent().indexOf(oSelectionDetails), -1, "showSelectionDetails is false : button is not in toolbar");
	});

	QUnit.test("SelectionDetails is not contained in toolbar, if chartContainer does not have content", function(assert) {
		//Arrange
		var oSelectionDetails = this.oChartContent._oSelectionDetails;
		var oToolbar = this.oChartContainer.getToolbar();
		//Act
		this.oChartContainer.removeAllContent();
		this.oChartContainer.setShowSelectionDetails(true);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.notOk(this.oChartContainer._getSelectionDetails(), "_getSelectionDetails returns null");
		assert.equal(oToolbar.getContent().indexOf(oSelectionDetails), -1, "SelectionDetails is not contained in toolbar");
	});

	QUnit.test("SelectionDetails is not included in toolbar if table is displayed", function(assert) {
		//Act
		this.oChartContainer.setShowSelectionDetails(true);
		this.oChartContainer.addContent(this.oTableContent);
		sap.ui.getCore().applyChanges();
		var oSelectionDetails = this.oChartContent._oSelectionDetails;
		var oToolbar = this.oChartContainer.getToolbar();

		//Assert
		assert.equal(oToolbar.getContent().indexOf(oSelectionDetails), -1, "SelectionDetails button is not created");
	});

	QUnit.module("Private methods", {
		beforeEach : function() {
			this.oVizFrame = new VizFrame();
			this.oChartContent = new ChartContainerContent({
				content: this.oVizFrame
			});
			this.oChartContainer = new ChartContainer({
				content: this.oChartContent
			});
			this.oSpy = sinon.spy(this.oChartContainer, "_getSelectionDetails");
			this.oChartContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChartContainer.destroy();
			this.oChartContainer = null;
			this.oSpy = null;
		}
	});

	QUnit.test("'_getSelectionDetails' method when showSelectionDetails is false", function(assert) {
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(this.oSpy.notCalled, "'_getSelectionDetails' method was not called");
	});

	QUnit.test("'_getSelectionDetails' method when showSelectioDetails is true", function(assert) {
		//Arrange
		this.oChartContainer.setShowSelectionDetails(true);
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(this.oSpy.called, "'_getSelectionDetails' method was called");
		assert.ok(this.oChartContainer._getSelectionDetails() instanceof sap.m.SelectionDetails, "'_getSelectionDetails' method returns SelectionDetails instance");
	});

	QUnit.module("Content changed", {
		beforeEach : function() {
			this.oVizFrame = new VizFrame();
			this.oChartContent = new ChartContainerContent({
				content: this.oVizFrame
			});
			this.oChartContainer = new ChartContainer({
				showSelectionDetails: true,
				content: this.oChartContent
			});
			this.oChartContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.test("SelectionDetails in ChartContainer toolbar", function(assert) {
		//Arrange
		var oToolbar = this.oChartContainer.getToolbar();
		var oSelectionDetails = this.oChartContent._oSelectionDetails;
		//Assert
		assert.ok(oToolbar.getContent().indexOf(oSelectionDetails) >= 0, "SelectionDetails button is visible in ChartContainer");
	});

	QUnit.test("Change to table ChartContainerContent", function(assert) {
		//Arrange
		var oToolbar = this.oChartContainer.getToolbar();
		var oTableContent = new ChartContainerContent({
			content: new Table()
		});
		var oTableSelectionDetails = oTableContent._oSelectionDetails,
			oChartSelectionDetails = this.oChartContent._oSelectionDetails;

		//Act
		this.oChartContainer.switchChart(oTableContent);
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(oToolbar.getContent().indexOf(oTableSelectionDetails), -1, "SelectionDetails button from table ChartContainerContent is not visible");
		assert.equal(oToolbar.getContent().indexOf(oChartSelectionDetails), -1, "SelectionDetails button from vizFrame chart ChartContainerContent is not visible");
	});

	QUnit.test("VizFrame change to table in ChartContainerContent", function(assert) {
		var oTableContent = new Table();
		var oToolbar = this.oChartContainer.getToolbar();
		var oSelectionDetails = this.oChartContent._oSelectionDetails;
		this.oChartContent.setContent(oTableContent);
		//Act
		this.oChartContainer.invalidate();
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(oToolbar.getContent().indexOf(oSelectionDetails), -1, "SelectionDetails button is not visible");
	});

	QUnit.module("Selection details");

	QUnit.test("Simple line marker", function (assert) {
		var oContent = new ChartContainerContent({
				content: new VizFrame()
			}),
			oChartContainer = new ChartContainer({
				showSelectionDetails: true,
				content: oContent
			}),
			sSvg = "<svg><line stroke='red' x1='0' x2='10' y1='1' y2='1' /></svg>";

		oChartContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		var oSelectionDetails = oChartContainer._getSelectionDetails();
		oSelectionDetails._handleSelectionChange(new Event("test-event", oChartContainer, {
			data: [
				{
					data: {},
					displayData: [
						{
							id: "1",
							label: "Item 1",
							value: "Value 1",
							type: "Dimension"
						},
						{
							id: "2",
							label: "Item 2",
							value: "Value 2",
							type: "Measure"
						}
					],
					shapeString: sSvg
				}
			]
		}));
		oSelectionDetails._callFactory();

		var aLines = oSelectionDetails.getItems()[0].getLines();
		assert.equal(aLines.length, 2, "Selection detail should have two lines");
		assert.equal(aLines[0].getLineMarker(), sSvg, "First line should have a line marker");
		assert.equal(aLines[1].getLineMarker(), "", "Second line shouldn't have a line marker");

		oChartContainer.destroy();
	});

	QUnit.test("Complex line marker", function (assert) {
		var oContent = new ChartContainerContent({
				content: new VizFrame()
			}),
			oChartContainer = new ChartContainer({
				showSelectionDetails: true,
				content: oContent
			}),
			mSvg = {
				"1": "<svg><line stroke='red' x1='0' x2='10' y1='1' y2='1' /></svg>",
				"2": "<svg><line stroke='blue' x1='0' x2='10' y1='1' y2='1' /></svg>"
			};

		oChartContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		var oSelectionDetails = oChartContainer._getSelectionDetails();
		oSelectionDetails._handleSelectionChange(new Event("test-event", oChartContainer, {
			data: [
				{
					data: {},
					displayData: [
						{
							id: "1",
							label: "Item 1",
							value: "Value 1",
							type: "Dimension"
						},
						{
							id: "2",
							label: "Item 2",
							value: "Value 2",
							type: "Measure"
						}
					],
					shapeString: mSvg
				}
			]
		}));
		oSelectionDetails._callFactory();

		var aLines = oSelectionDetails.getItems()[0].getLines();
		assert.equal(aLines.length, 2, "Selection detail should have two lines");
		assert.equal(aLines[0].getLineMarker(), mSvg["1"], "First line should have a line marker");
		assert.equal(aLines[1].getLineMarker(), mSvg["2"], "Second line should have a line marker");

		oChartContainer.destroy();
	});
});
