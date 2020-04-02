sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/Device',
	'sap/ui/core/util/MockServer',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/m/MessageToast',
	'sap/ui/comp/valuehelpdialog/example/AddMultipleItems/ValueHelpItemAdder'
], function (Controller, Device, MockServer, ODataModel, MessageToast, ValueHelpItemAdder) {
	"use strict";

	return Controller.extend("sap.ui.comp.valuehelpdialog.example.AddMultipleItems.ValueHelpDialog", {

		onInit: function () {
			// Set up and start Mockserver
			var oMockServer = new MockServer({
				rootUri: "/my/mock/data/"
			});
			oMockServer.simulate("AddMultipleItems/mockserver/metadata.xml", "AddMultipleItems/mockserver/");
			oMockServer.start();
			var oModel = new ODataModel("/my/mock/data/", true);
			this.getView().setModel(oModel);

			//Crate the ValueHelpItemAdder
			oModel.getMetaModel().loaded().then(function(){
				// The path needs to be provided by the application
				var sPath = "/OrderItemSet/ProductId";
				this.oVHA = new ValueHelpItemAdder(this.getView(), sPath);
			}.bind(this));
		},

		onSimplePlusButtonPressed: function () {
			//Uses the default ValueList Annotation
			var pValueHelp = this.oVHA.open();
			pValueHelp.then(
				function (aSelectedEntries) {
					this.createEntries(aSelectedEntries);
					MessageToast.show("OK pressed");
				}.bind(this),
				function () {
					MessageToast.show("Cancel pressed");
				}
			);
		},

		onAllPlusButtonPressed: function () {
			//Uses a certain ValueList Annotation, given via API
			var pValueHelp = this.oVHA.open("AllInformation");
			pValueHelp.then(
				function (aSelectedEntries) {
					this.createEntries(aSelectedEntries);
					MessageToast.show("OK pressed");
				}.bind(this),
				function () {
					MessageToast.show("Cancel pressed");
				}
			);
		},

		createEntries: function(aDataForEntries){
			for (var i = 0; i < aDataForEntries.length; i++) {
				this.getView().getModel().createEntry("OrderItemSet", {
					properties: {
						Id: "NEW-" + (Math.random() + "").substring(3,7),
						ProductId: aDataForEntries[i].Id,
						Quantity: "1"
					}
				});
			}
			this.getView().getModel().submitChanges();
		}
	});

});