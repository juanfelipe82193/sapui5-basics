/*global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/base/util/ObjectPath",
	"sap/viz/ui5/core/BaseChart",
	"sap/viz/ui5/core/BaseChartRenderer"
], function(ObjectPath, BaseChart, BaseChartRenderer) {

	// get list of wrapper controls
	var aChartWrappers = sap.ui.getCore().getLoadedLibraries()["sap.viz"].controls.filter(function(sControl) {
		return /^sap\.viz\.ui5\.[^.]+$/.test(sControl) && !/\.Viz[^.]+$/.test(sControl);
	});

	aChartWrappers.forEach(function(sControl) {

		QUnit.test("Chart Wrapper " + sControl, function(assert) {

			var done = assert.async();

			var sModuleName = sControl.replace(/\./g, "/");
			sap.ui.require([sModuleName], function(ChartImpl) {
				assert.ok(true, "module could be loaded");

				var oChart = new ChartImpl();
				assert.ok( oChart instanceof BaseChart, "wrapper should be instance of BaseChart");
				assert.ok( oChart.getRenderer() === BaseChartRenderer, "chart should inherit BaseChartRenderer");

				assert.ok( sap.ui.require(sModuleName + "Renderer"), "renderer should have been loaded");
				assert.ok( ObjectPath.get(sControl + "Renderer") === BaseChartRenderer, "renderer should be the BaseChartRenderer");
				done();
			}, function() {
				assert.ok(false, "module could not be loaded");
				done();
			});

		});

	})

	QUnit.start();

});
