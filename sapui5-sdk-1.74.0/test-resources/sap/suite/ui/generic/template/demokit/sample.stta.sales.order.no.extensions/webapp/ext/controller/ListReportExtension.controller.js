sap.ui.define("SOwoExt.ext.controller.ListReportExtension",
[
	"sap/base/Log",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Button"
], function (Log, Dialog, Text, Button) {
	"use strict";

	return {
		showSingleMessage: function (oEvent) {
			var sPrefix = "showSingleMessage-";
			var oTable = oEvent.getSource().getParent().getParent().getParent().getTable();
			var oExtensionAPI = this.extensionAPI;
			var aContext = oExtensionAPI.getSelectedContexts(oTable);
			var oContext = aContext[0];
			var oObject = oContext.getObject();
			var mParameters = {
				"SalesOrder": oObject.SalesOrder,
				"DraftUUID": oObject.DraftUUID,
				"IsActiveEntity": oObject.IsActiveEntity
			};
			var oParameterDialog = new Dialog({
				title: "Show the difference...",
				content: [
					new Text({
						text: "...between 2 methods. Check the console and filter for '" + sPrefix + "'. \n\n 'Invoke action' does not show a busy indicator or messages returned from backend. \n\n"
					}),
					new Button({
						text: "invoke Action",
						press: function () {
							//invoke action example - base for secured execution - the returned message is NOT shown on the UI
							var oPromise = oExtensionAPI.invokeActions("STTA_SALES_ORDER_WD_20_SRV_Entities/C_STTA_SalesOrder_WD_20Showsinglemsg", [], mParameters);
							oPromise.then(function (aResponse) {
								// "Stuff worked!" - resolve case
								var sMessage = aResponse["0"].response.response.headers["sap-message"];
								var oMessage = JSON.parse(sMessage);
								Log.error(sPrefix + "resolve: " + oMessage.message);
							}, function (aResponse) {
								Log.error(sPrefix + "reject"); // Error: "It broke" - reject case
							});
							oParameterDialog.close();
						}
					}),
					new Button({
						text: "secured Execution",
						press: function () {
							//same action method via secured execution - the returned message is NOW shown on the UI
							var fnFunction = function () {
								return oExtensionAPI.invokeActions("STTA_SALES_ORDER_WD_20_SRV_Entities/C_STTA_SalesOrder_WD_20Showsinglemsg", [], mParameters);
							};
							var mParametersForSecuredExecution = {
								"sActionLabel": "Your App specific title"
								/*"busy" : true*/
								//see here the possible parameters: ListReport.extensionAPI.ExtensionAPI/methods/securedExecution
							};
							var oPromise = oExtensionAPI.securedExecution(fnFunction, mParametersForSecuredExecution);
							oPromise.then(function (aResponse) { // "Stuff worked!" - resolve case
								Log.error(sPrefix + "resolve");
							}, function (aResponse) {
								Log.error(sPrefix + "reject"); // Error: "It broke" - reject case
							});
							oParameterDialog.close();
						}
					})
				],
				endButton: new Button({
					text: "Cancel",
					press: function () {
						oParameterDialog.close();
					}
				}),
				afterClose: function () {
					oParameterDialog.destroy();
				}
			});
			oParameterDialog.open();
		}
	};
});
