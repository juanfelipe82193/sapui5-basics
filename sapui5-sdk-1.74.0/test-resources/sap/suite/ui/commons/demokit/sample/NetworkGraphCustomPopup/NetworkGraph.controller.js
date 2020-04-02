sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Label",
	"sap/m/Popover",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/suite/ui/commons/networkgraph/Node"
], function (Controller, JSONModel, Label, Popover, Button, ButtonType, Node) {
	var iNodeKey = 0;

	var oPageController = Controller.extend("sap.suite.ui.commons.sample.NetworkGraphCustomPopup.NetworkGraph", {
		onInit: function () {
			var oModel = new JSONModel(jQuery.sap.getModulePath("sap.suite.ui.commons.sample.NetworkGraphCustomPopup", "/graph.json")),
				oGraph, oToolbar;

			this.getView().setModel(oModel);

			oGraph = this.getView().byId("graph");
			oToolbar = this.getView().byId("graph").getToolbar();

			oToolbar.insertContent(new Label("title", {
				text: "Customization Example"
			}), 0);

			/*
			 * Refresh button - add to toolbar
			 */
			oToolbar.insertContent(new Button("refreshButton", {
				type: ButtonType.Transparent,
				icon: "sap-icon://refresh",
				press: this.refreshGraph.bind(oGraph)
			}), 0);

			/*
			 * Add node button - add to toolbar
			 */
			oToolbar.insertContent(new Button("addButton", {
				type: ButtonType.Transparent,
				icon: "sap-icon://add",
				press: this.addNode.bind(oGraph)
			}), 1);
		},
		onExit: function () {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		},
		buttonPress: function (oElement) {
			if (!this._oPopover) {
				this._oPopover = new Popover();
				this._oPopover.setTitle("My Custom Popover");
			}
			this._oPopover.openBy(oElement.getParameter("buttonElement"));
		},
		refreshGraph: function () {
			this.invalidate();
		},
		addNode: function () {
			this.addNode(new Node({
				key: "customNode" + ( ++iNodeKey),
				title: ("Custom node " + iNodeKey),
				icon: "sap-icon://wrench",
				status: sap.suite.ui.commons.networkgraph.ElementStatus.Success
			}));
		},
		nodePress: function (oEvent) {
			var oNode = oEvent.getSource();

			if (oNode.getKey() === "c_node") {
				if (!this._oPopoverForNode) {
					this._oPopoverForNode = new Popover({
						title: "Node popover"
					});
				}
				// Prevents render a default action buttons
				oEvent.preventDefault();
				this._oPopoverForNode.openBy(oNode);
			}
		},
		linePress: function (oEvent) {
			if (!this._oPopoverForLine) {
				this._oPopoverForLine = new Popover({
					title: "Line popover"
				});
			}
			// Prevents render a default tooltip
			oEvent.preventDefault();
			this._oPopoverForLine.openBy(oEvent.getParameter("opener"));
		}
	});

	return oPageController;
});