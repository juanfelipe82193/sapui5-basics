sap.ui.define("STTA_SO_ND.ext.controller.DetailsExtension", [
	"sap/m/MessageToast"
], function (MessageToast) {
	"use strict";

	return {
		beforeDeleteExtension: function () {
			//simple way to change the delete dialog text
			var sContext = this.getView().getBindingContext().getPath();
			var oMessageText = {
				text: "My Text",
				title: "My Title (Breakout)"
			};
			return (oMessageText);
		},
		onInit: function () {
			if (this.extensionAPI && this.extensionAPI.attachPageDataLoaded) {
				this.extensionAPI.attachPageDataLoaded(this.onPageDataLoadedExtension);
			}
		},
		onPageDataLoadedExtension: function (oEvent) {
			// This extension is called in case of create and when navigating to Object Page
			// We need a better example here
			MessageToast.show("attachPageDataLoaded extension example");
		}
	};
});
