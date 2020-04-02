sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/model/json/JSONModel',
	'personalization/Util'
], function(
	Controller,
	ODataModel,
	JSONModel,
	TestUtil
) {
	"use strict";

	return Controller.extend("view.Main", {

		onInit: function() {


			var oModel = new ODataModel("applicationUnderTestDimeasure");
			this.getView().setModel(oModel);
			oModel.getMetaModel().loaded().then(function(){
				this.getView().setModel(new JSONModel({
					ColumnKeys: TestUtil.getColumnKeysFromODataModel(oModel, "ProductCollection").map(function(sColumnKey) {
						return {
							columnKey: sColumnKey
						};
					})
				}), "JSON");
			}.bind(this));
		},

		onSetDataSuiteFormatPress: function() {
			var oSmartChart = this.getView().byId("IDSmartChart");
			TestUtil.openDialogDataSuiteFormat(oSmartChart.getUiState.bind(oSmartChart), oSmartChart.setUiState.bind(oSmartChart));
		},

		onExit: function() {
			TestUtil.stopMockServer();
		}
	});
});
