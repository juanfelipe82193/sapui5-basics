sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (jQuery, Controller, JSONModel) {
	var oPageController = Controller.extend("sap.suite.ui.commons.sample.NetworkGraphLegend.NetworkGraph", {
		onInit: function () {
			var oModel = new JSONModel(jQuery.sap.getModulePath("sap.suite.ui.commons.sample.NetworkGraphLegend", "/graph.json"));
			this.getView().setModel(oModel);
			this._graph = this.byId("graph");

			// custom labels
			this._graph.setCustomLegendLabel({
				label: "Custom node label",
				status: "Success"
			});

			// custom labels
			this._graph.setCustomLegendLabel({
				label: "Custom line label",
				status: "Warning",
				isNode: false
			});

			this._graph.setCustomLegendLabel({
				label: "Custom group label",
				status: "Standard",
				isGroup: true
			});

			this._graph.attachEvent("graphReady", function (oEvent) {
				// show legend by default
				jQuery(".sapSuiteUiCommonsNetworkGraphLegend").show();
			});
		},
		legendChange: function (oEvent) {
			var sKey = oEvent.getSource().getProperty("selectedKey");
			if (sKey === "Default") {
				this._graph.destroyLegend();
			} else {
				this._graph.setLegend(new sap.ui.core.HTML({
					content: "<B>Custom HTML in legend</B>"
				}));
			}
		}
	});
	return oPageController;
});
