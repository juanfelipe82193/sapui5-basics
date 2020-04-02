sap.ui.define([
	"sap/suite/ui/commons/library",
	"sap/suite/ui/commons/networkgraph/layout/LayoutAlgorithm",
	"sap/suite/ui/commons/networkgraph/layout/LayoutTask"
], function (library, LayoutAlgorithm, LayoutTask) {
	var NetworkGraphTestLayout = LayoutAlgorithm.extend("test.sap.suite.ui.commons.qunit.NetworkGraphTestLayout", {
		constructor: function (fnLayout, bLayered) {
			this._fnLayout = fnLayout;
			this._bLayered = bLayered;

			LayoutAlgorithm.apply(this, arguments);
		}
	});

	NetworkGraphTestLayout.prototype.isLayered = function () {
		return this._bLayered;
	};

	NetworkGraphTestLayout.prototype.getLayoutRenderType = function () {
		return library.networkgraph.LayoutRenderType.LayeredWithGroups;
	};

	NetworkGraphTestLayout.prototype.layout = function () {
		return new LayoutTask(this._fnLayout);
	};

	return NetworkGraphTestLayout;
});