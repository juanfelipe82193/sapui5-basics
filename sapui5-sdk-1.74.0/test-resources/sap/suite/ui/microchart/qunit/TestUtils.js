/*global QUnit,sinon*/

sap.ui.define([
], function () {
	"use strict";
	return {
		initSizeModule: function(MicroChartClass, sSizeBaseClass) {
			QUnit.module("Sizes", {
				beforeEach: function() {
					this.oChart = new MicroChartClass();
					this.oChart.placeAt("qunit-fixture");
					sap.ui.getCore().applyChanges();
				},
				afterEach: function() {
					this.oChart.destroy();
					this.oChart = null;
				}
			});

			QUnit.test("Default size", function(assert) {
				var oSize = this.oChart.getSize();
				var $Chart = this.oChart.$();

				assert.equal(oSize, "Auto", "Default size set to auto");
				assert.ok($Chart.hasClass(sSizeBaseClass + "Auto"), "Size class <Auto> is active");
			});

			QUnit.test("Size M", function(assert) {
				this.oChart.setSize("M");
				this.oChart.rerender();
				var oSize = this.oChart.getSize();
				var $Chart = this.oChart.$();

				assert.equal(oSize, "M", "Size <M> was set");
				assert.ok($Chart.hasClass(sSizeBaseClass + "M"), "Size class <M> is active");
			});

			QUnit.test("Size L", function(assert) {
				this.oChart.setSize("L");
				this.oChart.rerender();
				var oSize = this.oChart.getSize();
				var $Chart = this.oChart.$();

				assert.equal(oSize, "L", "Size <L> was set");
				assert.ok($Chart.hasClass(sSizeBaseClass + "L"), "Size class <L> is active");
			});

			QUnit.test("Width and height can be overriden", function(assert) {
				this.oChart.setSize("L");
				this.oChart.setWidth("500px");
				this.oChart.setHeight("500px");

				sap.ui.getCore().applyChanges();

				var $Chart = this.oChart.$();

				assert.equal($Chart.width(), 500, "width is changed");
				assert.equal($Chart.height(), 500, "height is changed");
			});

			QUnit.test("Width and height changed when using size Responsive", function(assert) {
				this.oChart.setSize("Responsive");
				this.oChart.setWidth("500px");
				this.oChart.setHeight("500px");

				this.oChart.rerender();

				var $Chart = this.oChart.$();

				assert.equal($Chart.width(), 500, "width is changed");
				assert.equal($Chart.height(), 500, "height is changed");
			});

		}
	};
});


