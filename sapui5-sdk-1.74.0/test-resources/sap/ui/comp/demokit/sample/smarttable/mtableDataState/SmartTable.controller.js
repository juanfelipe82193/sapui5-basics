sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/core/util/MockServer',
	'sap/ui/core/message/Message'
], function (Controller, ODataModel, MockServer, Message) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smarttable.mtableDataState.SmartTable", {
		onInit: function () {
			var sPath = "test-resources/sap/ui/comp/demokit/sample/smarttable/mockserver/";
			this.oMockServer = new MockServer({
				rootUri: "mtableDataState/"
			});
			this.oMockServer.simulate(sPath + "metadata.xml", sPath);
			this.oMockServer.start();

			this.oModel = new ODataModel("mtableDataState", {
				defaultCountMode: "Inline"
			});

			this.oTable = this.byId("table");
			this.oDataStatePlugin = this.byId("dataStatePlugin");
			this.oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(this.oModel);
		},

		showRandomMessage: function() {
			var sTypes = Object.keys(sap.ui.core.ValueState);
			var sRandomType = sTypes[Math.floor(Math.random() * (sTypes.length - 1))];
			var sRandomText = Math.random().toString(36).substring(2);
			this.oDataStatePlugin.showMessage("Psst! This secret message is coming from the DataStateIndicator plugin: " + sRandomText, sRandomType);
		},

		onEnablePress: function(oEvent) {
			this.oDataStatePlugin.setEnabled(oEvent.getParameter("pressed"));
		},

		onCustomHandlingPress: function(oEvent) {
			this.bCustomHandling = oEvent.getParameter("pressed");
			if (this.bCustomHandling) {
				this.oDataStatePlugin.showMessage("");
			} else {
				this.byId("msgBtn").setVisible(false);
			}
		},

		onDataStateChange: function(oEvent) {
			if (!this.bCustomHandling) {
				return;
			}

			oEvent.preventDefault();

			var oDataState = oEvent.getParameter("dataState");
			var aMessages = oDataState.getMessages();
			var oMsgBtn = this.byId("msgBtn");
			if (aMessages.length) {
				oMsgBtn.setVisible(true).setText(aMessages.length);
				oMsgBtn.setIcon("sap-icon://message-" + aMessages[0].getType().toLowerCase());
			} else {
				oMsgBtn.setVisible(false);
			}
		},

		onFilterChange: function(oEvent) {
			this.sFilterValue = oEvent.getSource().getSelectedKey();
		},

		dataStateFilter: function(oMessage) {
			if (!this.sFilterValue) {
				return true;
			}

			return oMessage.getType() == this.sFilterValue;
		},

		addTableMessage: function(sType) {
			var sTableBindingPath = this.oTable.getBinding("items").getPath();
			this.oMessageManager.addMessages(
				new Message({
					message: "Hold on! " + sType + " message came out for the table.",
					fullTarget: sTableBindingPath,
					target: sTableBindingPath,
					type: sType,
					processor: this.oModel
				})
			);
		},

		addInputMessage: function(sType) {
			var aItems = this.oTable.getItems();
			var iRandomIndex = Math.floor(Math.random() * aItems.length);
			var sRandomBindingPath = aItems.map(function(oItem) {
				return oItem.getBindingContext().getPath();
			})[iRandomIndex];

			this.oMessageManager.addMessages(
				new Message({
					message: sType + " message on Input at index " + (iRandomIndex + 1),
					fullTarget: sRandomBindingPath + "/Name1",
					target: sRandomBindingPath + "/Name1",
					type: sType,
					processor: this.oModel
				})
			);
		},

		clearMessages: function() {
			this.oMessageManager.removeAllMessages();
		},

		onExit: function () {
			this.oMockServer.stop();
		}
	});
});
