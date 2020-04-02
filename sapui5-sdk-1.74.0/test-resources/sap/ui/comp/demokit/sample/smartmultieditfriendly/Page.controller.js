sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/core/util/MockServer",
	"sap/m/MessageToast",
	"sap/ui/model/resource/ResourceModel"
], function(ODataModel, MockServer, MessageToast, ResourceModel) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmultieditfriendly.Page", {
		onInit: function() {
			var oModel, oView, oTable;
			var oMockServer = new MockServer({
				rootUri: "smartmultieditfriendly.Employees/"
			});
			this._oMockServer = oMockServer;
			oMockServer.simulate(
				"test-resources/sap/ui/comp/demokit/sample/smartmultieditfriendly/mockserver/metadata.xml",
				"test-resources/sap/ui/comp/demokit/sample/smartmultieditfriendly/mockserver/");

			oMockServer.start();
			oModel = new ODataModel("smartmultieditfriendly.Employees", true);
			oModel.setDefaultBindingMode("TwoWay");
			oView = this.getView();
			oView.setModel(oModel);

			oTable = this.getView().byId("tblUserData").getTable();
			oTable.setMode("MultiSelect");
			oTable.attachSelectionChange(this.onTableSelection, this);
		},

		onExit: function() {
			this._oMockServer.stop();
		},

		onOpenMultiEdit: function() {
			this.oMultiEditDialog = sap.ui.xmlfragment("sap.ui.comp.sample.smartmultieditfriendly.MultiEditDialog", this);
			this.getView().addDependent(this.oMultiEditDialog);
			this.oMultiEditDialog.setEscapeHandler(function() {
				this.onCloseDialog();
			}.bind(this));

			this.oMultiEditDialog.getContent()[0].setContexts(this.getView().byId("tblUserData").getTable().getSelectedContexts());
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.oMultiEditDialog);
			this.oMultiEditDialog.open();
		},

		onCloseDialog: function() {
			this.oMultiEditDialog.close();
			this.oMultiEditDialog.destroy();
			this.oMultiEditDialog = null;
		},

		onTableSelection: function () {
			var aSelectedItems = this.getView().byId("tblUserData").getTable().getSelectedItems();
			this.getView().byId("btnMultiEdit").setEnabled(aSelectedItems.length > 0);
		},

		onDialogSaveButton: function () {
			var oMultiEditContainer = this.oMultiEditDialog.getContent()[0];

			this.oMultiEditDialog.setBusy(true);
			oMultiEditContainer.getErroneousFieldsAndTokens().then(function (aErrorFields) {
				this.oMultiEditDialog.setBusy(false);
				if (aErrorFields.length === 0) {
					this._saveChanges();
				}
			}.bind(this)).catch(function () {
				this.oMultiEditDialog.setBusy(false);
			}.bind(this));
		},

		_saveChanges: function () {
			var oMultiEditContainer = this.oMultiEditDialog.getContent()[0],
				that = this,
				aUpdatedContexts,
				oContext,
				oUpdatedData,
				oObjectToUpdate,
				oUpdatedDataCopy;

			var fnHandler = function (oField) {
				var sPropName = oField.getPropertyName(),
					sUomPropertyName = oField.getUnitOfMeasurePropertyName();
				if (!oField.getApplyToEmptyOnly() || !oObjectToUpdate[sPropName]
					|| (typeof oObjectToUpdate[sPropName] == "string" && !oObjectToUpdate[sPropName].trim())) {
					oUpdatedDataCopy[sPropName] = oUpdatedData[sPropName];
				}
				if (oField.isComposite()) {
					if (!oField.getApplyToEmptyOnly() || !oObjectToUpdate[sUomPropertyName]) {
						oUpdatedDataCopy[sUomPropertyName] = oUpdatedData[sUomPropertyName];
					}
				}
			};

			MessageToast.show("Save action started", {
				onClose: function () {
					oMultiEditContainer.getAllUpdatedContexts(true).then(function (result) {
						MessageToast.show("Updated contexts available", {
							onClose: function () {
								aUpdatedContexts = result;
								for (var i = 0; i < aUpdatedContexts.length; i++) {
									oContext = aUpdatedContexts[i].context;
									oUpdatedData = aUpdatedContexts[i].data;
									oObjectToUpdate = oContext.getModel().getObject(oContext.getPath());
									oUpdatedDataCopy = {};
									this._getFields().filter(function (oField) {
										return !oField.isKeepExistingSelected();
									}).forEach(fnHandler);
									oContext.getModel().update(oContext.getPath(), oUpdatedDataCopy);
								}
								MessageToast.show("Model was updated");

								that.onCloseDialog();
							}.bind(this)
						});
					}.bind(oMultiEditContainer));
				}
			});
			this.oMultiEditDialog.close();
		}
	});
});
