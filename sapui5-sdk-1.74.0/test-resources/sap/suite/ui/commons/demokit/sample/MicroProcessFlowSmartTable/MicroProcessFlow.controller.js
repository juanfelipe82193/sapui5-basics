sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/util/MockServer",
	"sap/suite/ui/commons/MicroProcessFlowItem",
	"sap/ui/model/json/JSONModel",
	"sap/m/ResponsivePopover",
	"sap/m/FlexBox",
	"sap/m/Title",
	"sap/suite/ui/commons/MicroProcessFlow",
	"sap/m/Button"
], function (Controller, ODataModel, MockServer, MicroProcessFlowItem, JSONModel, ResponsivePopover, FlexBox, Title, MicroProcessFlow,
             Button) {
	var STATUS_MAP = Object.freeze({
		"g": "Success",
		"w": "None",
		"y": "Warning",
		"r": "Error"
	});
	var oPageController = Controller.extend("sap.suite.ui.commons.sample.MicroProcessFlowSmartTable.MicroProcessFlow", {
		onInit: function () {
			var oMockServer = new MockServer({
				rootUri: "microprocessflow.Issues/"
			});
			this._oMockServer = oMockServer;
			oMockServer.simulate(
				"test-resources/sap/suite/ui/commons/demokit/sample/MicroProcessFlowSmartTable/mockserver/metadata.xml",
				"test-resources/sap/suite/ui/commons/demokit/sample/MicroProcessFlowSmartTable/mockserver/");
			oMockServer.start();

			var oModel = new ODataModel("microprocessflow.Issues", true);
			var oView = this.getView();
			var oTable = oView.byId("table");
			oTable.attachUpdateFinished(this.updateFinished, this);
			oView.setModel(oModel);
			var oJsonModel = new JSONModel({
				basePath: "test-resources/sap/suite/ui/commons/demokit/sample/MicroProcessFlowSmartTable/mockserver/"
			});
			oView.setModel(oJsonModel, "json");
		},
		onExit: function() {
			this._oMockServer.stop();
		},
		updateFinished: function () {
			var oTable = this.getView().byId("table");
			var that = this;
			oTable.getItems().forEach(function (oItem) {
				var oChart = oItem.getCells()[5],
					sStatus = oChart.data("Status"),
					aStatusItems = sStatus.split("-");
				aStatusItems.forEach(function (sStatus) {
					oChart.addContent(new MicroProcessFlowItem({
						state: STATUS_MAP[sStatus],
						press: [that.itemPressed, that]
					}));
				});
			});
		},
		itemPressed: function (oEvent) {
			var oPopover = this.getPopover();
			var oItem = oEvent.getSource();
			this._oMPFItem.setState(oItem.getState());
			switch (oItem.getState()) {
				case "Success":
					this._oPopoverText.setText("Success");
					break;
				case "Warning":
					this._oPopoverText.setText("Confirmation Pending");
					break;
				case "None":
					this._oPopoverText.setText("In Progress");
					break;
				case "Error":
					this._oPopoverText.setText("Rejected");
					break;
			}
			oPopover.openBy(oItem);
		},
		getPopover: function () {
			if (!this._oPopover) {
				this._oPopoverText = new Title({
					level: "H2",
					text: "Test"
				});
				this._oMPFItem = new MicroProcessFlowItem({
					state: "Warning"
				});
				this._oPopover = new ResponsivePopover({
					title: "Status",
					contentWidth: "300px",
					contentHeight: "150px",
					endButton: new Button({
						text: "Close",
						press: function () {
							this._oPopover.close();
						}.bind(this)
					}),
					content: new FlexBox({
						fitContainer: true,
						alignItems: "Center",
						// justifyContent: "Center",
						items: [
							new MicroProcessFlow({
								content: this._oMPFItem
							}).addStyleClass("sapUiSmallMargin"),
							this._oPopoverText
						]
					})
				});
			}
			return this._oPopover;
		}
	});
	return oPageController;
});
