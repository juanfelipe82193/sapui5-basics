sap.ui.define(['jquery.sap.global', 'sap/suite/ui/commons/library', 'sap/m/library', 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/ui/Device', 'sap/m/MessageToast',
	'sap/suite/ui/commons/ProcessFlowConnectionLabel', 'sap/m/StandardListItem', 'sap/m/Button', 'sap/m/List', 'sap/m/ResponsivePopover'],
	function(jQuery, SuiteLibrary, MobileLibrary, Controller, JSONModel, Device, MessageToast, ProcessFlowConnectionLabel, StandardListItem, Button, List, ResponsivePopover) {
	"use strict";

	return Controller.extend("sap.suite.ui.commons.sample.ProcessFlowConnectionLabels.ProcessFlow", {

		//-----------------------------------------------------------------------------------------------------------------------------
		// Global Properties
		//-----------------------------------------------------------------------------------------------------------------------------

		aConnections: null, // Required to access elements in callback since they are coming from oEvent.
		sContainerId: "", // Required in order to access the right container

		//-----------------------------------------------------------------------------------------------------------------------------
		// Event Handlers
		//-----------------------------------------------------------------------------------------------------------------------------

		onInit: function() {
			var sDataPath,
				oModel,
				oModel2;
			oModel = new JSONModel();
			sDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowConnectionLabels", "/ProcessFlowLanesAndNodesWithLabels.json");
			oModel.loadData(sDataPath);
			var oView = this.getView();

			this.oProcessFlow1 = oView.byId("processflow1");
			this.oProcessFlow1.setModel(oModel);

			oModel2 = new JSONModel();
			sDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowConnectionLabels", "/ProcessFlowScrollableLanesAndNodesWithLabels.json");
			oModel2.loadData(sDataPath);

			this.oProcessFlow2 = oView.byId("processflow2");
			this.oProcessFlow2.setModel(oModel2);

			oModel.attachRequestCompleted(this.oProcessFlow1.updateModel.bind(this.oProcessFlow1));
			oModel2.attachRequestCompleted(this.oProcessFlow2.updateModel.bind(this.oProcessFlow2));
		},

		onLabelPress: function(oEvent) {
			this.aConnections = oEvent.getParameter("connections");
			this.sContainerId = oEvent.getSource().getId().split("-")[2];
			var oSelectedLabel = oEvent.getParameter("selectedLabel");
			var oListData = this._getListData(this.aConnections);
			var oItemTemplate = new StandardListItem({ title: "{title}", info: "{info}" });
			var oList = this._createList(oListData, oItemTemplate);

			var oResponsivePopover;

			var oBeginButton = new Button({
				text: "Action1",
				type: MobileLibrary.ButtonType.Reject,
				press: function() {
					oResponsivePopover.setShowCloseButton(false);
				}
			});

			var oEndButton = new Button({
				text: "Action2",
				type: MobileLibrary.ButtonType.Accept,
				press: function() {
					oResponsivePopover.setShowCloseButton(true);
				}
			});

			oResponsivePopover = sap.ui.getCore().byId("__popover") || new ResponsivePopover("__popover", {
				placement: MobileLibrary.PlacementType.Auto,
				title: "Paths[" + this.aConnections.length + "]",
				content: [ oList ],
				showCloseButton: false,
				afterClose: function() {
					oResponsivePopover.destroy();
					this.getView().byId(this.sContainerId).setFocusToLabel(oSelectedLabel);
				}.bind(this),
				beginButton: oBeginButton,
				endButton: oEndButton
			});

			if (Device.system.phone) {
				oResponsivePopover.setShowCloseButton(true);
			}
			oResponsivePopover.openBy(oSelectedLabel);
		},

		onListItemPress: function(oEvent) {
			var selectedItem = oEvent.getParameter("listItem");
			var aSourceTarget = selectedItem.getInfo().split("-");
			var sSourceId = aSourceTarget[0];
			var sTargetId = aSourceTarget[1];
			this._getItemBySourceAndTargetId(sSourceId, sTargetId);
		},

		onHideConnectionLabels: function() {
			if (this.oProcessFlow1.getShowLabels()) {
				this.oProcessFlow1.setShowLabels(false);
			} else {
				this.oProcessFlow1.setShowLabels(true);
			}
		},

		onOnError: function(oEvent) {
			var sDisplay = "Exception happened: ";
			sDisplay += oEvent.getParameters().text;
			MessageToast.show(sDisplay);
		},

		onZoomIn: function() {
			this.oProcessFlow1.zoomIn();
			this.oProcessFlow1.getZoomLevel();
			MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
		},

		onZoomOut: function() {
			this.oProcessFlow1.zoomOut();
			this.oProcessFlow1.getZoomLevel();
			MessageToast.show("Zoom level changed to: " + this.oProcessFlow1.getZoomLevel());
		},

		onNodePress: function(event) {
			MessageToast.show("Node " + event.getParameters().getNodeId() + " has been clicked.");
		},

		onHighlightPath: function() {
			var oProcessFlow = this.oProcessFlow1,
				oModel = oProcessFlow.getModel(),
				sDataPath;

			this._isHighlighted = !this._isHighlighted;
			if (this._isHighlighted) {
				sDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowConnectionLabels", "/ProcessFlowLanesAndNodesWithLabelsHighlighted.json");
				MessageToast.show("Path has been highlighted.");
			} else {
				sDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowConnectionLabels", "/ProcessFlowLanesAndNodesWithLabels.json");
				MessageToast.show("Path is no longer highlighted.");
			}
			oModel.loadData(sDataPath);
		},

		onResetSelection: function() {
			this.oProcessFlow1.setSelectedPath(null, null);
		},

		// ProcessFlow 2: Scrollable

		onZoomInS: function() {
			this.oProcessFlow2.zoomIn();

			MessageToast.show("Zoom level changed to: " + this.oProcessFlow2.getZoomLevel());
		},

		onZoomOutS: function() {
			this.oProcessFlow2.zoomOut();

			MessageToast.show("Zoom level changed to: " + this.oProcessFlow2.getZoomLevel());
		},

		onLabelPressS: function(oEvent) {
			var oSelectedLabel = oEvent.getParameter("selectedLabel");
			MessageToast.show("Label pressed: " + oSelectedLabel.getText());
		},

		onHighlightPathS: function() {
			var oProcessFlow = this.oProcessFlow2,
				oModel2 = oProcessFlow.getModel(),
				sDataPath;

			this._isHighlighted2 = !this._isHighlighted2;
			if (this._isHighlighted2) {
				sDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowConnectionLabels", "/ProcessFlowScrollableLanesAndNodesWithLabelsHighlighted.json");
				MessageToast.show("Path has been highlighted.");
			} else {
				sDataPath = jQuery.sap.getModulePath("sap.suite.ui.commons.sample.ProcessFlowConnectionLabels", "/ProcessFlowScrollableLanesAndNodesWithLabels.json");
				MessageToast.show("Path is no longer highlighted.");
			}
			oModel2.loadData(sDataPath);
		},

		//-----------------------------------------------------------------------------------------------------------------------------
		// Helpers
		//-----------------------------------------------------------------------------------------------------------------------------

		_createList: function(data, itemTemplate) {
			var oModel = new JSONModel();

			// Sets the data for the model
			oModel.setData(data);

			// Sets the model to the list
			var oTmpList = new List({
				mode: MobileLibrary.ListMode.SingleSelectMaster,
				selectionChange: this.onListItemPress.bind(this)
			});
			oTmpList.setModel(oModel);

			// Binds Aggregation
			oTmpList.bindAggregation("items", "/navigation", itemTemplate);

			return oTmpList;
		},

		_getListData: function() {
			var aNavigation = [];
			for (var i = 0; i < this.aConnections.length; i++) {
				aNavigation.push(this._createListEntryObject(this.aConnections[i]));
			}

			return {
				navigation: aNavigation
			};
		},

		_createListEntryObject: function(oConnection) {
			var sId = oConnection.sourceNode.getNodeId() + "-" + oConnection.targetNode.getNodeId();
			var sTitle = oConnection.label.getText();

			return {
				title: sTitle,
				info: sId,
				type: "Active"
			};
		},

		_getItemBySourceAndTargetId: function(sSourceId, sTargetId) {
			for (var i = 0; i < this.aConnections.length; i++) {
				if (this.aConnections[i].sourceNode.getNodeId() === sSourceId && this.aConnections[i].targetNode.getNodeId() === sTargetId) {
					this.getView().byId(this.sContainerId).setSelectedPath(sSourceId, sTargetId);
				}
			}
		},

		//-----------------------------------------------------------------------------------------------------------------------------
		// Formatters
		//-----------------------------------------------------------------------------------------------------------------------------

		formatConnectionLabels: function(childrenData) {
			var aChildren = [];
			for (var i = 0; childrenData &&  i < childrenData.length; i++) {
				if (childrenData[i].connectionLabel && childrenData[i].connectionLabel.id) {
					var oConnectionLabel = sap.ui.getCore().byId(childrenData[i].connectionLabel.id);
					if (!oConnectionLabel) {
						oConnectionLabel = new ProcessFlowConnectionLabel({
							id: childrenData[i].connectionLabel.id,
							text: childrenData[i].connectionLabel.text,
							enabled: childrenData[i].connectionLabel.enabled,
							icon: childrenData[i].connectionLabel.icon,
							state: childrenData[i].connectionLabel.state,
							priority: childrenData[i].connectionLabel.priority
						});
					}
					aChildren.push({
						nodeId: childrenData[i].nodeId,
						connectionLabel: oConnectionLabel
					});
				} else if (jQuery.type(childrenData[i]) === 'number'){
					aChildren.push(childrenData[i]);
				}
			}
			return aChildren;
		}
	});
});
