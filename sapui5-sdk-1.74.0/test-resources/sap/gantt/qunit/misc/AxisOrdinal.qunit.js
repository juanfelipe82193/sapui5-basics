/*global QUnit */
sap.ui.define([
	"sap/gantt/misc/AxisOrdinal"
], function (AxisOrdinal) {
	"use strict";

	QUnit.module("Test sap.gantt.misc.AxisOrdinal", {
		beforeEach: function () {
			var config = sap.ui.getCore().getConfiguration();
			this.originalLanguage = config.getLanguage();
			config.setLanguage("en");
		},
		afterEach: function () {
			var config = sap.ui.getCore().getConfiguration();
			config.setLanguage(this.originalLanguage);
			this.originalLanguage = undefined;
		}
	});

	QUnit.test("test for AxisOrdinal", function (assert) {
		var columns = [{
			title: "ID",
			width: "50px"
		}, {
			title: "Name",
			width: "100px"
		}
		];
		var columnTitle = columns.map(function (column) {
			return column.title;
		});
		var columnScale = columns.map(function (column) {
			return parseInt(column.width, 10);
		});
		var viewBand = 1;
		var axisX2 = new AxisOrdinal(columnTitle, columnScale, viewBand, 0, undefined, 2, 10, 5);
		var axisX = axisX2.clone();
		axisX2.setZoomOrigin(0).setZoomRate(1).setElements([], []);


		// assertion
		assert.strictEqual(axisX.elementToView("ID"), -10, "Test AxisOrdinal: elementToView with first element");
		assert.strictEqual(axisX.elementToView("Name"), 90, "Test AxisOrdinal: elementToView with last element");
		assert.strictEqual(axisX.viewToElement(-11), undefined, "Test AxisOrdinal: viewToElement with value below whole lower boundary");
		assert.strictEqual(axisX.viewToElement(-10), "ID", "Test AxisOrdinal: viewToElement with lower boundary of first element");
		assert.strictEqual(axisX.viewToElement(79), "ID", "Test AxisOrdinal: viewToElement with upper boundary of first element");
		assert.strictEqual(axisX.viewToElement(80), undefined, "Test AxisOrdinal: viewToElement with value over the upper boundary of first element");
		assert.strictEqual(axisX.viewToElement(89), undefined, "Test AxisOrdinal: viewToElement with value below the lower boundary of last element");
		assert.strictEqual(axisX.viewToElement(90), "Name", "Test AxisOrdinal: viewToElement with lower boundary of last element");
		assert.strictEqual(axisX.viewToElement(279), "Name", "Test AxisOrdinal: viewToElement with upper boundary of last element");
		assert.strictEqual(axisX.viewToElement(280), undefined, "Test AxisOrdinal: viewToElement with value over whole upper boundary");
		assert.strictEqual(axisX.getViewRange()[0] === -20 && axisX.getViewRange()[1] === 280, true, "Test AxisOrdinal: getViewRange");
		assert.strictEqual(axisX.getViewBandWidth(), 2, "Test AxisOrdinal: getViewBandWidth");
		assert.strictEqual(axisX.viewToBandIndex(8), -1, "Test AxisOrdinal: viewToBandIndex");
		assert.strictEqual(axisX.viewToElementIndex(8), 0, "Test AxisOrdinal: viewToElementIndex");
		assert.strictEqual(axisX.viewToRowIndex(300, 500), 152, "Test AxisOrdinal: viewToRowIndex");
		assert.deepEqual(axisX.getElementArray(), ["ID", "Name"], "Test AxisOrdinal: getElementArray");
		assert.deepEqual(axisX.getScaleArray(), [50, 100], "Test AxisOrdinal: getScaleArray");
		assert.strictEqual(axisX.getZoomOrigin(), 10, "Test AxisOrdinal: getZoomOrigin");
		assert.strictEqual(axisX.getZoomRate(), 2, "Test AxisOrdinal: getZoomRate");
		assert.deepEqual(axisX.getViewRange(), [-20, 280], "Test AxisOrdinal: getViewRange");
		assert.strictEqual(axisX.getViewBandWidth(), 2, "Test AxisOrdinal: getViewBandWidth");
	});
});
