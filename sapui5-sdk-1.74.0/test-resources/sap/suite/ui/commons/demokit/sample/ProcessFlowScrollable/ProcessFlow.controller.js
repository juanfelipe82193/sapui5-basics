sap.ui.define([ 'jquery.sap.global', 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/suite/ui/commons/library', 'sap/m/MessageToast' ],
	function(jQuery, Controller, JSONModel, library, MessageToast) {
	"use strict";

	return Controller.extend("sap.suite.ui.commons.sample.ProcessFlowScrollable.ProcessFlow", {
		onInit: function () {
			var oModel = new JSONModel();
			oModel.setData({
				nodes: [],
				lanes: []
			});

			this.getView().setModel(oModel);
			this.oProcessFlow1 = this.getView().byId("processflow1");
			this.oProcessFlow2 = this.getView().byId("processflow2");

			oModel.attachRequestCompleted(this.oProcessFlow2.updateModel.bind(this.oProcessFlow2));
		},

		onNodePress: function(event) {
			MessageToast.show("Node " + event.getParameters().getNodeId() + " has been clicked.");
		},

		onZoomIn: function () {
			this.oProcessFlow1.zoomIn();

			MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
		},

		onZoomOut: function () {
			this.oProcessFlow1.zoomOut();

			MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
		},

		onDisplayProcessFlow: function () {
			var sDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowScrollable", "/ProcessFlowNodes.json");

			this.getView().getModel().loadData(sDataPath);
			MessageToast.show("Process Flow has been displayed.");
		},

		onHighlightPath: function () {
			var sDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowScrollable", "/ProcessFlowNodesHighlighted.json");

			this.getView().getModel().loadData(sDataPath);
			MessageToast.show("Path has been highlighted.");
		},

		onUpdateProcessFlow: function () {
			var sDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowScrollable", "/ProcessFlowUpdatedNodesHighlighted.json");

			this.getView().getModel().loadData(sDataPath);
			MessageToast.show("Update model done.");
		}
	});
});
