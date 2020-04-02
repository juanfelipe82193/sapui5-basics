sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/ui/export/Spreadsheet',
	'sap/m/MessageToast'
], function(Controller, JSONModel, Spreadsheet, MessageToast) {
	'use strict';

	return Controller.extend('sap.ui.export.sample.json.Spreadsheet', {

		onInit: function() {
			var oModel = new JSONModel(sap.ui.require.toUrl('sap/ui/export/sample/localService/mockdata/Users.json'));
			this.getView().setModel(oModel);
		},

		createColumnConfig: function() {
			return [
				{
					label: 'User ID',
					property: 'UserID',
					type: 'number',
					scale: 0
				},
				{
					label: 'Firstname',
					property: 'Firstname',
					width: '25'
				},
				{
					label: 'Lastname',
					property: 'Lastname',
					width: '25'
				},
				{
					label: 'Salary',
					property: 'Salary',
					type: 'currency',
					unitProperty: 'Currency',
					width: '18'
				},
				{
					label: 'Active',
					property: 'Active',
					type: 'string'
				}];
		},

		onExport: function() {
			var aCols, aProducts, oSettings, oSheet;

			aCols = this.createColumnConfig();
			aProducts = this.getView().getModel().getProperty('/');

			oSettings = {
				workbook: { columns: aCols },
				dataSource: aProducts
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then( function() {
					MessageToast.show('Spreadsheet export has finished');
				})
				.finally(function() {
					oSheet.destroy();
				});
		}
	});
});
