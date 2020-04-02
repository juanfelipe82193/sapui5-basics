sap.ui.define([
	'sap/ui/core/mvc/Controller', 'sap/ui/comp/sample/smartlink/example_01/formatter'
], function(Controller, formatter) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartlink.example_01.Example", {

		formatter: formatter,

		onInit: function() {
			this.getView().bindElement("/ProductCollection('1239102')");
		},

		onSelectionChange: function(oEvent) {
			var sKey = oEvent.getParameters().selectedItem.getKey();
			var oSmartLink = this.getView().byId("IDSmartLink");
			oSmartLink.setSemanticObject(sKey);
		}
	});
});
