sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel'
], function(Controller, ODataModel) {
	'use strict';

	return Controller.extend('sap.ui.export.sample.smarttable.Spreadsheet', {

		onInit: function () {
			var sURL, sAlternativeURL, oModel, oView;

			sURL = '../../../../proxy/https/services.odata.org/V2/Northwind/Northwind.svc';
			sAlternativeURL = './proxy/https/services.odata.org/V2/Northwind/Northwind.svc';

			oModel = new ODataModel(window.isTestsuite ? sURL : sAlternativeURL);

			oView = this.getView();
			oView.setModel(oModel);
		}
	});
});
