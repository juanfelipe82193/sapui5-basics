sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel'
], function(Controller, ODataModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfilterbar.UseDateRangeType.SmartFilterBar", {
		onInit: function() {
			var oModel = new ODataModel("/MockDataService", true);
			this.getView().setModel(oModel);
		}
	});
});
