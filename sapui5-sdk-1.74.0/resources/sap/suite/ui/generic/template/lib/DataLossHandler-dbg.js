sap.ui.define(["sap/ui/base/Object", "sap/base/util/extend"],function(BaseObject, extend) {
	"use strict";

	function getMethods(oTemplateContract) {

		function fnResetChangesAndFireCancelEvent(oController, oComponentUtils) {
			var oModel = oTemplateContract.oAppComponent.getModel();
			if (oModel.hasPendingChanges()) {
				var oView = oController.getView();
				oView.setBindingContext(null);
				oModel.resetChanges();
				oView.setBindingContext();
			}
			oComponentUtils.setEditableNDC(false);
			var oUiModel = oController.getOwnerComponent().getModel("ui");
			oUiModel.setProperty("/editable", false);
			oComponentUtils.fire(oController, "AfterCancel", {});
		}

		var fnOnDataLossConfirmed;
		var fnOnDataLossCancel;
		/*
        ShowsDataLosspopup
        */
		function fnDataLossConfirmation(onDataLossConfirmed, onDataLossCancel, oApplication, oController, sMode, bIsTechnical) {
			var oDataLossModel;
			fnOnDataLossConfirmed = onDataLossConfirmed;
			fnOnDataLossCancel = onDataLossCancel;
			var sFragmentname = bIsTechnical ? "sap.suite.ui.generic.template.fragments.DataLossTechnicalError" : "sap.suite.ui.generic.template.fragments.DataLoss";
			var oDataLossPopup = oApplication.getDialogFragmentForView(oController.getView(), sFragmentname, {
				onDataLossOK: function () {
					oDataLossPopup.close();
					fnOnDataLossConfirmed();
				},
				onDataLossCancel: function () {
					oDataLossPopup.close();
					fnOnDataLossCancel();
				}
			},"dataLoss");
			sMode = sMode || "LeavePage";
			oDataLossModel = oDataLossPopup.getModel("dataLoss");
			oDataLossModel.setProperty("/mode",sMode);
			oDataLossPopup.open();
		}

		function fnPerformIfNoDataLossImpl(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck) {
			if (!bNoBusyCheck && oTemplateContract.oBusyHelper.isBusy()) {
				return;
			}
			var aActiveComponents = oTemplateContract.oNavigationControllerProxy.getActiveComponents();

			var oFirstRegistryEntryEditable, oFirstRegistryEntryWithExternalChanges, oFirstRegistryEntry; // will be set to the corresponding registry entry for the view which might have pending non-draft changes if there is one
			// "first" always refers to the first registry entry found fulfilling the condition. Registry is ordered by viewLevel (if not, this check should be added accordingly)
			aActiveComponents.forEach(function(sComponentId){ // ensure, that application callback is called for all active views
				var oRegistryEntry = oTemplateContract.componentRegistry[sComponentId];
				if (oRegistryEntry.utils.isDraftEnabled()) {
					return;
				}
				oFirstRegistryEntry = oFirstRegistryEntry || oRegistryEntry;
				var oUiModel = oRegistryEntry.oComponent.getModel("ui");
				if (oUiModel.getProperty("/editable")) {
					oFirstRegistryEntryEditable = oFirstRegistryEntryEditable || oRegistryEntry;
				}
				if (oRegistryEntry.aUnsavedDataCheckFunctions && oRegistryEntry.aUnsavedDataCheckFunctions.some(function (fnUnsavedCheck){
					return fnUnsavedCheck();
				})) {
					oFirstRegistryEntryWithExternalChanges = oFirstRegistryEntryWithExternalChanges || oRegistryEntry;
				}
			});
			var oRelevantComponentRegistryEntry = oFirstRegistryEntryWithExternalChanges || oFirstRegistryEntryEditable || oFirstRegistryEntry; // this defines the priority of the indications which view might be the right one to choose for the popup - room for discussion
			if (oRelevantComponentRegistryEntry){ // there is a non-draft enabled view
				var oModel = oTemplateContract.oAppComponent.getModel();
				if (oFirstRegistryEntryWithExternalChanges || oModel.hasPendingChanges()){
					fnDataLossConfirmation(function(){
						fnResetChangesAndFireCancelEvent(oRelevantComponentRegistryEntry.oController, oRelevantComponentRegistryEntry.utils); // TODO: check, whether cancel function should rather also be executed for all views
						fnProcessFunction();
					}, function(){
						fnCancelFunction();
					}, oRelevantComponentRegistryEntry.oApplication, oRelevantComponentRegistryEntry.oController, sMode, false);
					return;
				}
				var oUiModel = oRelevantComponentRegistryEntry.oController.getOwnerComponent().getModel("ui");
				if (oUiModel.getProperty("/editable")){
					oUiModel.setProperty("/editable", false);
					oRelevantComponentRegistryEntry.utils.fire(oRelevantComponentRegistryEntry.oController, "AfterCancel", {});
				}
			}
			fnProcessFunction();
		}

		function fnPerformIfNoDataLoss(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck) {
			if (bNoBusyCheck) {
				return fnPerformIfNoDataLossImpl(fnProcessFunction, fnCancelFunction, sMode, true);
			}
			return oTemplateContract.oApplicationProxy.performAfterSideEffectExecution(fnPerformIfNoDataLossImpl.bind(null, fnProcessFunction, fnCancelFunction, sMode, false));
		}

		return {
			performIfNoDataLoss: fnPerformIfNoDataLoss
		};

	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.DataLossHandler", {
		constructor: function (oTemplateContract) {
			extend(this, getMethods(oTemplateContract));
		}
	});
});
