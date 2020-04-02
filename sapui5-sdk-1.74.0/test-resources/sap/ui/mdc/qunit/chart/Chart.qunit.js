/* global QUnit */
sap.ui.define([
	"sap/ui/mdc/Chart", "sap/ui/mdc/chart/MeasureItem", "sap/ui/mdc/chart/DimensionItem", "sap/ui/core/UIComponent", "sap/ui/core/ComponentContainer"
], function(Chart, MeasureItem, DimensionItem, UIComponent, ComponentContainer) {
	"use strict";

	QUnit.module("sap.ui.mdc.Chart: Simple Properties", {
		beforeEach: function() {
			var TestComponent = UIComponent.extend("test", {
				metadata: {
					manifest: {
						"sap.app": {
							"id": "",
							"type": "application"
						}
					}
				},
				createContent: function() {
					return new Chart("IDChart", {});
				}
			});
			this.oUiComponent = new TestComponent("IDComponent");
			this.oUiComponentContainer = new ComponentContainer({
				component: this.oUiComponent,
				async: false
			});
			this.oChart = this.oUiComponent.getRootControl();

			this.oUiComponentContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oUiComponentContainer.destroy();
			this.oUiComponent.destroy();
		}
	});

	QUnit.test("Instantiate", function(assert) {
		assert.ok(this.oChart);
	});

	QUnit.test("Create MDC Chart (default) after initialise", function(assert) {
		var done = assert.async();
		assert.ok(this.oChart, "The chart is created");

		this.oChart.oChartPromise.then(function() {
			var oChart = this.getAggregation("_chart");
			assert.ok(oChart, "After loading the chart library there is an inner chart");
			assert.ok(this.getAggregation("_toolbar"), "The chart has a toolbar");
			done();
		}.bind(this.oChart));
	});

	QUnit.test("Setting the chart type", function(assert) {
		var done = assert.async();

		this.oChart.setChartType("bullet");
		this.oChart.oChartPromise.then(function() {
			var oChart = this.getAggregation("_chart");
			assert.ok(oChart, "After loading the chart library there is an inner chart");
			var sChartType = oChart.getChartType();
			assert.equal(sChartType, "bullet", "The chart type is forwarded to the inner chart");
			this.setChartType("column");
			sChartType = oChart.getChartType();
			assert.equal(sChartType, "column", "If the inner chart is there then the type is directly feed");
			done();
		}.bind(this.oChart));
	});

	QUnit.test("Setting the height", function(assert) {
		var done = assert.async();

		this.oChart.setHeight("1300px");
		this.oChart.oChartPromise.then(function() {
			var oChart = this.getAggregation("_chart");
			assert.ok(oChart, "After loading the chart library there is an inner chart");
			var iHeight = oChart.getHeight();
			assert.equal(iHeight, "100%", "The inner chart remains in height 100%");
			this.setHeight("700px");
			iHeight = oChart.getHeight();
			assert.equal(iHeight, "100%", "The inner chart remains in height 100%");
			done();
		}.bind(this.oChart));
	});

	QUnit.test("Setting the selection mode", function(assert) {
		var done = assert.async();
		this.oChart.setSelectionMode("SINGLE");
		// Note: if we do not wait until oSelectionHandlerPromise is resolved it will break due to duplicate id of Chart's toolbar
		this.oChart.oChartPromise.then(function() {
			this.oChart.oSelectionHandlerPromise.then(function() {
				done();
			});
		}.bind(this));

		var done1 = assert.async();
		this.oChart.oChartPromise.then(function() {
			var oChart = this.getAggregation("_chart");
			assert.ok(oChart, "After loading the chart library there is an inner chart");
			var sSelectionMode = oChart.getSelectionMode();
			assert.equal(sSelectionMode, "SINGLE", "The selection mode is forwarded to the inner chart");
			this.setSelectionMode("NONE");
			sSelectionMode = oChart.getSelectionMode();
			assert.equal(sSelectionMode, "NONE", "If the inner chart is there then the width is directly feed");
			done1();
		}.bind(this.oChart));
	});

	QUnit.module("sap.ui.mdc.Chart: Items", {
		beforeEach: function() {
			var TestComponent = UIComponent.extend("test", {
				metadata: {
					manifest: {
						"sap.app": {
							"id": "",
							"type": "application"
						}
					}
				},
				createContent: function() {
					return new Chart("IDChart", {
						chartType: "bullet",
						items: [
							new DimensionItem({
								key: "Name",
								label: "Name",
								role: "category"
							}), new MeasureItem({
								type: "Measure",
								key: "agSalesAmount",
								propertyPath: "SalesAmount",
								label: "Depth",
								role: "axis1",
								aggregationMethod: "sum"
							})
						]
					});
				}
			});

			this.oUiComponent = new TestComponent("IDComponent");
			this.oUiComponentContainer = new ComponentContainer({
				component: this.oUiComponent,
				async: false
			});
			this.oChart = this.oUiComponent.getRootControl();

			this.oUiComponentContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oUiComponentContainer.destroy();
			this.oUiComponent.destroy();
		}
	});

	QUnit.test("Items after instantiation", function(assert) {
		var done = assert.async();

		this.oChart.oChartPromise.then(function() {
			var oChart = this.getAggregation("_chart");
			var aDimension = oChart.getDimensions();
			var aMeasures = oChart.getMeasures();
			assert.equal(aDimension.length, 1, "There is  one dimension in the inner chart");
			assert.equal(aMeasures.length, 1, "There is  one measure in the inner chart");
			done();
		}.bind(this.oChart));
	});

	QUnit.test("Adding Items w/o knowledge of existence of the inner chart", function(assert) {
		var done = assert.async();

		this.oChart.addItem(new MeasureItem({
			key: "SalesNumber",
			label: "Width",
			role: "axis2"
		}));

		this.oChart.oChartPromise.then(function() {
			var oChart = this.getAggregation("_chart");
			var aDimension = oChart.getDimensions();
			var aMeasures = oChart.getMeasures();
			assert.equal(aDimension.length, 1, "There is  one dimension in the inner chart");
			assert.equal(aMeasures.length, 2, "There are two measures in the inner chart");

			done();
		}.bind(this.oChart));
	});

	QUnit.test("Adding Items with knowledge of existence of the inner chart", function(assert) {
		var done = assert.async();

		this.oChart.oChartPromise.then(function() {
			var oChart = this.getAggregation("_chart");
			//add a new measure
			this.addItem(new MeasureItem({
				key: "SalesNumber",
				label: "Width",
				role: "axis2"
			}));

			var aDimension = oChart.getDimensions();
			var aMeasures = oChart.getMeasures();
			assert.equal(aDimension.length, 1, "There is  one dimension in the inner chart");
			assert.equal(aMeasures.length, 2, "There are two measures in the inner chart");

			done();
		}.bind(this.oChart));
	});

	QUnit.test("Removing items does not remove the item from the inner chart", function(assert) {
		var done = assert.async();

		var oItem = this.oChart.getItems()[1];
		this.oChart.removeItem(oItem);
		assert.equal(1, this.oChart.getItems().length, "The item is removed");

		this.oChart.oChartPromise.then(function() {
			var oChart = this.getAggregation("_chart");
			var aDimension = oChart.getDimensions();
			var aMeasures = oChart.getMeasures();
			assert.equal(aDimension.length, 1, "There is still one dimension in the inner chart");
			assert.equal(aMeasures.length, 1, "There is still one measure in the inner chart");

			oItem = this.getItems()[0];
			this.removeItem(oItem);
			assert.equal(0, this.getItems().length, "The item is removed, there is no longer any item");
			aDimension = oChart.getDimensions();
			aMeasures = oChart.getMeasures();
			assert.equal(aDimension.length, 1, "There is still one dimension in the inner chart");
			assert.equal(aMeasures.length, 1, "There is still one measure in the inner chart");

			done();
		}.bind(this.oChart));
	});

	QUnit.module("sap.ui.mdc.Chart: Visible dimensions and measures (update)", {
		beforeEach: function() {
			var TestComponent = UIComponent.extend("test", {
				metadata: {
					manifest: {
						"sap.app": {
							"id": "",
							"type": "application"
						}
					}
				},
				createContent: function() {
					return new Chart("IDChart", {
						chartType: "bullet",
						items: [
							new DimensionItem({
								key: "Name",
								label: "Name",
								role: "category"
							}), new MeasureItem({
								name: "agSalesAmount",
								propertyPath: "SalesAmount",
								label: "Depth",
								role: "axis1",
								aggregationMethod: "sum"
							})
						]
					});
				}
			});

			this.oUiComponent = new TestComponent("IDComponent");
			this.oUiComponentContainer = new ComponentContainer({
				component: this.oUiComponent,
				async: false
			});
			this.oChart = this.oUiComponent.getRootControl();

			this.oUiComponentContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oUiComponentContainer.destroy();
			this.oUiComponent.destroy();
		}
	});

	QUnit.test("Visibility after instantiation", function(assert) {
		var done = assert.async();

		this.oChart.oChartPromise.then(function() {
			var oChart = this.getAggregation("_chart");
			var aVisibleDimension = oChart.getVisibleDimensions();
			var aVisibleMeasures = oChart.getVisibleMeasures();
			assert.equal(aVisibleDimension.length, 1, "There is  one visible dimension in the inner chart");
			assert.equal(aVisibleMeasures.length, 1, "There is  one visible measure in the inner chart");
			done();
		}.bind(this.oChart));
	});

	QUnit.test("Adding Items w/o knowledge of existence of the inner chart", function(assert) {
		var done = assert.async();

		this.oChart.addItem(new MeasureItem({
			key: "SalesNumber",
			label: "Width",
			role: "axis2"
		}));

		this.oChart.oChartPromise.then(function() {
			var oChart = this.getAggregation("_chart");
			var aVisibleDimension = oChart.getVisibleDimensions();
			var aVisibleMeasures = oChart.getVisibleMeasures();
			assert.equal(aVisibleDimension.length, 1, "There is  one visible dimension in the inner chart");
			assert.equal(aVisibleMeasures.length, 2, "There are visible two measures in the inner chart");

			var oItem = this.getItems()[2];
			this.removeItem(oItem);
			aVisibleDimension = oChart.getVisibleDimensions();
			aVisibleMeasures = oChart.getVisibleMeasures();
			assert.equal(aVisibleDimension.length, 1, "There is still one visible dimension in the inner chart");
			assert.equal(aVisibleMeasures.length, 1, "There is still one visible measure in the inner chart");
			done();
		}.bind(this.oChart));
	});

	QUnit.module("sap.ui.mdc.Chart: Item visibility", {
		beforeEach: function() {
			var TestComponent = UIComponent.extend("test", {
				metadata: {
					manifest: {
						"sap.app": {
							"id": "",
							"type": "application"
						}
					}
				},
				createContent: function() {
					return new Chart("IDChart", {
						chartType: "bullet",
						items: [
							new DimensionItem({
								key: "Name",
								label: "Name",
								role: "category"
							}), new MeasureItem({
								key: "agSalesAmount",
								propertyPath: "SalesAmount",
								label: "Depth",
								role: "axis1",
								aggregationMethod: "sum"
							}), new MeasureItem({
								key: "SalesNumber",
								label: "Width",
								role: "axis2",
								visible: false
							})
						]
					});
				}
			});

			this.oUiComponent = new TestComponent("IDComponent");
			this.oUiComponentContainer = new ComponentContainer({
				component: this.oUiComponent,
				async: false
			});
			this.oChart = this.oUiComponent.getRootControl();

			this.oUiComponentContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oUiComponentContainer.destroy();
			this.oUiComponent.destroy();
		}
	});

	QUnit.test("Only visible items are visible in the chart", function(assert) {
		var done = assert.async();

		this.oChart.oChartPromise.then(function() {
			var oChart = this.getAggregation("_chart");
			var aDimension = oChart.getDimensions();
			var aMeasures = oChart.getMeasures();
			assert.equal(aDimension.length, 1, "There is one dimension in the inner chart");
			assert.equal(aMeasures.length, 2, "There are two measures in the inner chart");

			// now visiblitity of the measures and dimensions
			var aVisibleDimension = oChart.getVisibleDimensions();
			var aVisibleMeasures = oChart.getVisibleMeasures();
			assert.equal(aVisibleDimension.length, 1, "There is  one visible dimension in the inner chart");
			assert.equal(aVisibleMeasures.length, 1, "There is  one visible measure in the inner chart");

			//set the second measure visible
			var aItems = this.getItems();
			var oSalesNumber = aItems[2];
			oSalesNumber.setVisible(true);
			aVisibleMeasures = oChart.getVisibleMeasures();
			assert.equal(aVisibleMeasures.length, 2, "Now there are two measures visible");
			done();
		}.bind(this.oChart));
	});

	QUnit.test("Toggle InResult property of dimensionsional Item", function(assert) {
		var done = assert.async();

		this.oChart.oChartPromise.then(function() {
			var oInnerChart = this.getAggregation("_chart");
			var oDimension = this.getItems()[0];

			assert.equal(oDimension.getInResult(), false, "Default value of inResult is false");
			assert.equal(oInnerChart.getInResultDimensions().length, 0, "No inResultDimensions set on inner Chart initially");

			// set inResult of dimension instance to true
			oDimension.setInResult(true);
			assert.equal(oInnerChart.getInResultDimensions().length, 1, "inResultDimensions of inner chart contains one dimension");
			assert.equal(oInnerChart.getInResultDimensions()[0], oDimension.getKey(), "Correct dimension successfully set on inResultDimensions of inner chart.");

			// set inResult of dimension instance to false
			oDimension.setInResult(false);
			assert.equal(oInnerChart.getInResultDimensions().length, 0, "inResultDimensions of inner chart removed successfully");

			done();
		}.bind(this.oChart));
	});
});
