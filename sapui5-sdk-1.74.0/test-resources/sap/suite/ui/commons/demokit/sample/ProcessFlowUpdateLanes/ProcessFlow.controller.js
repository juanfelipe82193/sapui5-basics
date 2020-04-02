sap.ui.define([ 'jquery.sap.global', 'sap/suite/ui/commons/library', 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/m/MessageToast', 'sap/suite/ui/commons/ProcessFlowLaneHeader' ],
	function(jQuery, SuiteLibrary, Controller, JSONModel, MessageToast, ProcessFlowLaneHeader) {
	"use strict";

	return Controller.extend("sap.suite.ui.commons.sample.ProcessFlowUpdateLanes.ProcessFlow", {
		onInit: function () {
			var sDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowUpdateLanes", "/ProcessFlowNodes.json");
			var oModel = new JSONModel(sDataPath);
			this.getView().setModel(oModel);

			this.oProcessFlow = this.getView().byId("processflow");
			this.oProcessFlow.updateModel();
		},

		onOnError: function(event) {
			MessageToast.show("Exception occurred: " + event.getParameter("text"));
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
		},

		onUpdateModelAdd: function () {
			if (this.oProcessFlow.getLanes().length < 3) {
				var oLaneHeader = new ProcessFlowLaneHeader({
					iconSrc: "sap-icon://money-bills",
					text: "In Accounting",
					position: 2
				});
				this.oProcessFlow.addLane(oLaneHeader);
				this.oProcessFlow.updateModel();
				MessageToast.show("Model has been updated.");
			}
		}
	});
});
