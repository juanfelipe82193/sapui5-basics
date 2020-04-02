/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP AG. All rights reserved
 */

/**
* @class editApplication
* @name newApplication
* @description Controls the dialog for editing an existing application. It is opened from the application list.
* 		The ViewData for this view needs the following parameters:
* 		   parentControl 	- calling view - the application list
* 		   coreApi 	       - core instance
* 		   applicationData -id, description, semanticObject
*/
sap.ui.define([
	'sap/apf/modeler/ui/utils/nullObjectChecker'
], function (nullObjectChecker) {
	"use strict";

	function _setDisplayText(oController) {
		var getText = oController.coreApi.getText;
		oController.byId("idEditAppDialog").setTitle(getText("editApplication"));
		oController.byId("idDescriptionLabel").setText(getText("description"));
		if (oController.coreApi.showSemanticObject()) {
			oController.byId("idSemanticObjectLabel").setText(getText("semanticObject"));
		}
		oController.byId("idSaveButton").setText(getText("save"));
		oController.byId("idCancelButton").setText(getText("cancel"));
	}
	return sap.ui.controller("sap.apf.modeler.ui.controller.editApplication", {
		onInit : function() {
			var oController = this;
			this.parentControl = oController.getView().getViewData().parentControl;
			this.coreApi = oController.getView().getViewData().coreApi;
			this.applicationData = oController.getView().getViewData().applicationData;
			oController.byId("idDescriptionInput").setValue(this.applicationData.description);
			if (this.coreApi.showSemanticObject()) {
				oController.byId("idSemanticObjectInput").setValue(this.applicationData.semanticObject);
			} else {
				oController.byId("idSemanticObjectInput").setValue("");
				oController.byId("idSemanticObjectBox").setVisible(false);
			}
			_setDisplayText(oController);
			oController.byId("idEditAppDialog").open();
		},
		handleAppDescriptionLiveChange : function(oEvent) {

			var newDescription = oEvent.getParameters().value;
			if (newDescription !== this.applicationData.description && nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(newDescription)) {
				this.byId("idSaveButton").setEnabled(true);
			} else if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(newDescription)){
				this.byId("idSaveButton").setEnabled(false);
			}
		},
		handleSemanticObjectLiveChange : function(oEvent) {

			var newSemanticObject = oEvent.getParameters().value;
			var description = this.byId("idDescriptionInput").getValue().trim();
			if (newSemanticObject !== this.applicationData.semanticObject && nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(description)) {
				this.byId("idSaveButton").setEnabled(true);
			}
		},
		handleSavePress : function() {
			var oController = this;
			var appObject = {};
			appObject.ApplicationName = oController.byId("idDescriptionInput").getValue().trim();
			appObject.SemanticObject = oController.byId("idSemanticObjectInput").getValue().trim();
			appObject.Application = oController.applicationData.id;
			this.coreApi.getApplicationHandler(function(oApplicationHandler, messageObject) {
				if (oApplicationHandler && !nullObjectChecker.checkIsNotUndefined(messageObject)) {
					oApplicationHandler.setAndSave(appObject, function(oResponse, oMetadata, msgObj) {
						if (!nullObjectChecker.checkIsNotUndefined(msgObj) && (typeof oResponse === "string")) {
							oController.parentControl.fireEvent("updateAppListEvent", {
								"appId" : oResponse
							});
						} else {
							oController.showMessage("11500", messageObject);
						}
					}, oController.applicationData.id);
				} else {
					oController.showMessage("11509", messageObject);
				}
			});
			oController.byId("idEditAppDialog").close();
		},
		handleCancelPress : function() {
			this.byId("idEditAppDialog").close();
		},
		handleAfterClose : function() {
			this.getView().destroy();
		},
		showMessage : function(messageNumber, previousMessageObject) {
			var oMessageObject = this.coreApi.createMessageObject({
				code : messageNumber
			});
			if (previousMessageObject) {
				oMessageObject.setPrevious(previousMessageObject);
			}
			this.coreApi.putMessage(oMessageObject);
		}
	});
});