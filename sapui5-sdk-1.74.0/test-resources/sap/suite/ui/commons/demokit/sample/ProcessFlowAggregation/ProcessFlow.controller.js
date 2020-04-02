sap.ui.define([ 'jquery.sap.global', 'sap/suite/ui/commons/library', 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/m/MessageToast' ],
	function(jQuery, SuiteLibrary, Controller, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("sap.suite.ui.commons.sample.ProcessFlowAggregation.ProcessFlow", {
		onInit: function () {
			var oDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowAggregation", "/ProcessFlowNodeRegular.json");
			var oModel = new JSONModel(oDataPath);

			this.oProcessFlow = this.getView().byId("processflow");
			this.oProcessFlow.setZoomLevel(SuiteLibrary.ProcessFlowZoomLevel.Three);
			oModel.attachRequestCompleted(this.oProcessFlow.updateModel.bind(this.oProcessFlow));

			this.getView().setModel(oModel);
		},

		onHighlight: function() {
			var oModel = this.getView().getModel();
			var sDataPath;

			if (this.oProcessFlow.getNodes()[0].getHighlighted()) {
				sDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowAggregation", "/ProcessFlowNodeRegular.json");
			} else {
				sDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowAggregation", "/ProcessFlowNodeHighlighted.json");
			}
			oModel.loadData(sDataPath);
			MessageToast.show("Highlighted status of first node has been updated");
		},

		onNodePress: function(event) {
			MessageToast.show("Node " + event.getParameters().getNodeId() + " has been clicked.");
		},

		onZoomIn: function () {
			this.oProcessFlow.zoomIn();

			MessageToast.show("Zoom level changed to: " + this.oProcessFlow.getZoomLevel());
		},

		onZoomOut: function () {
			this.oProcessFlow.zoomOut();

			MessageToast.show("Zoom level changed to: " + this.oProcessFlow.getZoomLevel());
		}
	});
});
