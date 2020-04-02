/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP AG. All rights reserved
 */

/**
* @class newApplication
* @name newApplication
* @description Controls the dialog for creating a new application. It is opened from the application list.
* 			   The ViewData for this view needs the following parameters:
*  			   oParentControl 	   - table where list of applications are stored
*   		   oCoreApi 	       - core instance
*/
sap.ui.define([
	'sap/apf/modeler/ui/utils/nullObjectChecker'
], function (nullObjectChecker) {
	"use strict";

	function _setDisplayText(oController) {
		var oTextReader = oController.coreApi.getText;
		oController.byId("idNewAppDialog").setTitle(oTextReader("newApplication"));
		oController.byId("idDescriptionLabel").setText(oTextReader("description"));
		if (oController.coreApi.showSemanticObject()) {
			oController.byId("idSemanticObjectLabel").setText(oTextReader("semanticObject"));
		}

		oController.byId("idSaveButton").setText(oTextReader("save"));
		oController.byId("idCancelButton").setText(oTextReader("cancel"));
	}
	return sap.ui.controller("sap.apf.modeler.ui.controller.newApplication", {
		onInit : function() {
			var oController = this;
			this.parentControl = oController.getView().getViewData().oParentControl;
			this.coreApi = oController.getView().getViewData().oCoreApi;
			oController.byId("idDescriptionInput").setValue("");
			if (this.coreApi.showSemanticObject()) {
				oController.byId("idSemanticObjectInput").setValue("FioriApplication");
			} else {
				oController.byId("idSemanticObjectInput").setValue("");
				oController.byId("idSemanticObjectBox").setVisible(false);
			}
			_setDisplayText(oController);
			oController.byId("idNewAppDialog").open();
		},
		handleAppDescriptionLiveChange : function(oEvent) {
			var oController = this;
			var bIsAppDescriptionChanged = oEvent.getParameters().value.trim().length !== 0 ? true : false;
			oController.byId("idSaveButton").setEnabled(bIsAppDescriptionChanged);
		},
		handleSavePress : function() {
			var oController = this;
			var appObject = {};
			appObject.ApplicationName = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oController.byId("idDescriptionInput").getValue().trim()) ? oController.byId("idDescriptionInput").getValue().trim() : undefined;
			appObject.SemanticObject = nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oController.byId("idSemanticObjectInput").getValue().trim()) ? oController.byId("idSemanticObjectInput").getValue().trim() : undefined;
			this.coreApi.getApplicationHandler(function(oApplicationHandler, messageObject) {
				if (oApplicationHandler && !nullObjectChecker.checkIsNotUndefined(messageObject)) {
					oApplicationHandler.setAndSave(appObject, function(oResponse, oMetadata, msgObj) {
						if (!nullObjectChecker.checkIsNotUndefined(msgObj) && (typeof oResponse === "string")) {
							oController.parentControl.fireEvent("addNewAppEvent", {
								"appId" : oResponse
							});
						} else {
							var oMessageObject = oController.coreApi.createMessageObject({
								code : "11500"
							});
							oMessageObject.setPrevious(msgObj);
							oController.coreApi.putMessage(oMessageObject);
						}
					});
				} else {
					var oMessageObject = oController.coreApi.createMessageObject({
						code : "11509"
					});
					oMessageObject.setPrevious(messageObject);
					oController.coreApi.putMessage(oMessageObject);
				}
			});
			oController.getView().destroy();
		},
		handleCancelPress : function() {
			var oController = this;
			oController.getView().destroy();
		}
	});
});