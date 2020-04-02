sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageToast'
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.filterbar.example1.FilterBar", {

		onReset: function (oEvent) {
			var sMessage = "onReset trigered";
			MessageToast.show(sMessage);
		},

		onSearch: function (oEvent) {
			var sMessage = "onSearch trigered";
			MessageToast.show(sMessage);
		}

	});
});