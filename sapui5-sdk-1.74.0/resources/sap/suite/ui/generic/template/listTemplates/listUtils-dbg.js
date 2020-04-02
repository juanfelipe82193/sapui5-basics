sap.ui.define(["sap/ui/core/library"],
	function(coreLibrary) {
		"use strict";

		// shortcut for sap.ui.core.MessageType
		var MessageType = coreLibrary.MessageType;

		var sLocalModelName = "msg";

		// Method to be called in onBeforeRebindTable or onBeforeRebindChart to ensure that errors are handled accordingly
		function fnHandleErrorsOnTableOrChart(oTemplateUtils, oEvent){
			var oBindingParams = oEvent.getParameter("bindingParams");
			oBindingParams.events = oBindingParams.events || {};
			oBindingParams.events.aggregatedDataStateChange = function(oChangeEvent){
				var oBusyHelper = oTemplateUtils.oServices.oApplication.getBusyHelper();
				// Do not show the messages in the following situations:
				// a) app is busy: Transient messages will be shown at the end of the busy session anyway
				// b) the binding contains entries: In this case the request was successfull -> error messages coming with the request would be state messages
				if (oBusyHelper.isBusy() || oChangeEvent.getSource().getLength()){
					return;
				}
				var oDataState = oChangeEvent.getParameter("dataState");
				var aErrors = oDataState.getMessages().filter(function(oMessage){
					return oMessage.target === oChangeEvent.getSource().getPath() && oMessage.getType() === MessageType.Error;
				});
				if (aErrors.length){
					var oMessageManager = sap.ui.getCore().getMessageManager();
					oMessageManager.removeMessages(aErrors);
					var oPopup, oLocalModel, oMessageView;
					oPopup = oTemplateUtils.oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.listTemplates.fragments.MessagesOnRetrieval", {
						itemSelected: function(){
							oLocalModel.setProperty("/backbtnvisibility", true);
						},
						onBackButtonPress: function(){
							oMessageView.navigateBack();
							oLocalModel.setProperty("/backbtnvisibility", false);
						},
						onReject: function(){
							oMessageView.navigateBack();
							oPopup.close();
						}
					}, sLocalModelName, function(oFragment){
						oMessageView = oFragment.getContent()[0];
					});
					oLocalModel = oPopup.getModel(sLocalModelName);
					oLocalModel.setProperty("/messages", aErrors);
					oLocalModel.setProperty("/backbtnvisibility", false);
					oPopup.open();
				}
			};
		}


		return {
			handleErrorsOnTableOrChart: fnHandleErrorsOnTableOrChart
		};
	});
