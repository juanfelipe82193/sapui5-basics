sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/suite/ui/commons/ProcessFlowNode',
	'sap/m/VBox',
	'sap/m/Text',
	'sap/m/library'
], function(jQuery, Controller, JSONModel, MessageToast, ProcessFlowNode, VBox, Text, MobileLibrary) {
	"use strict";

	return Controller.extend("sap.suite.ui.commons.sample.ProcessFlowNodeContainer.ProcessFlow", {
		onInit: function() {
			var oView = this.getView();
			this.oProcessFlow = oView.byId("processflow");

			var sDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowNodeContainer", "/ProcessFlowLanesAndNodes.json");
			this.oModel = new JSONModel(sDataPath);
			oView.setModel(this.oModel);
		},

		onZoomIn: function () {
			this.oProcessFlow.zoomIn();
			MessageToast.show("Zoom level changed to: " + this.oProcessFlow.getZoomLevel());
		},

		onZoomOut: function () {
			this.oProcessFlow.zoomOut();
			MessageToast.show("Zoom level changed to: " + this.oProcessFlow.getZoomLevel());
		},

		onNodePress: function (oEvent) {
			MessageToast.show("Node " + oEvent.getParameters().getNodeId() + " has been clicked.");
		},

		createProcessFlowNode: function (sId, oContext) {
			var aCustomLevelConfigs, fnSetter, oContent, oNode = new ProcessFlowNode(sId, {
				laneId: "{lane}",
				nodeId: "{id}",
				title: "{title}",
				titleAbbreviation: "{titleAbbreviation}",
				children: "{children}",
				texts: "{texts}"
			});

			aCustomLevelConfigs = oContext.getProperty("customLevelConfigs");
			if (aCustomLevelConfigs && aCustomLevelConfigs.length > 0) {
				for (var i = 0; i < aCustomLevelConfigs.length; i++) {
					oContent = this.createCustomContent(i);
					fnSetter = oNode["setZoomLevel" + aCustomLevelConfigs[i].level + "Content"];
					if (fnSetter && typeof fnSetter === "function") {
						fnSetter.call(oNode, oContent);
					}
				}
			}
			return oNode;
		},

		createCustomContent: function (oLevel) {
			var oContent = new VBox({
				items: [
					new Text({
						text: "{customLevelConfigs/" + oLevel + "/customContentTitle}"
					}).addStyleClass("sapUiTinyMarginBottom"),
					new Text({
						text: "{customLevelConfigs/" + oLevel + "/customContentText}"
					})
				],
				renderType: MobileLibrary.FlexRendertype.Bare
			});
			return oContent;
		}
	});
});
