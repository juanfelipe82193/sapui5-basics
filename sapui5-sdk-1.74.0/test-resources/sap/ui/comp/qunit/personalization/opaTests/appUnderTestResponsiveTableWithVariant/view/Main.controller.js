sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel'

], function(
	Controller,
	ODataModel
) {
	"use strict";

	return Controller.extend("view.Main", {

		onInit: function() {
			this.getView().setModel(new ODataModel("appUnderTestResponsiveTableWithVariant"));
		}
	});
});
