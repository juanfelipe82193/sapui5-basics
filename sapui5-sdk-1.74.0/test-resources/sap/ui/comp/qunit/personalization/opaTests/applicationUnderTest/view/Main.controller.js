sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/model/json/JSONModel',
	'sap/m/TextArea',
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/base/util/merge'

], function(
	Controller,
	ODataModel,
	JSONModel,
	TextArea,
	Dialog,
	Button,
	merge
) {
	"use strict";

	return Controller.extend("view.Main", {

		onInit: function() {
			var oModel = new ODataModel("applicationUnderTest");
			this.getView().setModel(oModel);
			oModel.getMetaModel().loaded().then(function() {
				this.getView().setModel(new JSONModel({
					ColumnKeys: this._getColumnKeysFromODataModel(oModel, "ProductCollection").map(function(sColumnKey) {
						return {
							columnKey: sColumnKey
						};
					})
				}), "JSON");
			}.bind(this));
		},

		onSetDataSuiteFormatPress: function() {
			var oSmartTable = this.getView().byId("IDSmartTable");
			this._openDialogDataSuiteFormat(oSmartTable.getUiState.bind(oSmartTable), oSmartTable.setUiState.bind(oSmartTable));
		},

		onSelectionFinish: function(oEvent) {
			this.getView().byId("IDSmartTable").deactivateColumns(oEvent.getParameter("selectedItems").map(function(oItem) {
				return oItem.getKey();
			}));
		},

		_getColumnKeysFromODataModel: function(oModel, sEntitySet) {
			var oMetaModel = oModel.getMetaModel();
			var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
			return oEntityType.property.map(function(oProperty) {
				return oProperty.name;
			});
		},

		_openDialogDataSuiteFormat: function(fnGetUiState, fnSetUiState) {
			var oTextArea = new TextArea({
				rows: 20,
				width: "700px"
			});
			var oUiState = fnGetUiState();
			var oDataSuiteFormat = merge({}, oUiState.getPresentationVariant());

			oTextArea.setValue(JSON.stringify(oDataSuiteFormat));
			var oDialog = new Dialog({
				title: "Edit PresentationVariant of the 'Data Suite Format'",
				content: oTextArea,
				beginButton: new Button({
					text: 'OK',
					press: function() {
						oUiState.setPresentationVariant(JSON.parse(oTextArea.getValue()));
						fnSetUiState(oUiState);
						oDialog.close();
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function() {
						oDialog.close();
					}
				})
			});
			oDialog.open();
		}
	});
});