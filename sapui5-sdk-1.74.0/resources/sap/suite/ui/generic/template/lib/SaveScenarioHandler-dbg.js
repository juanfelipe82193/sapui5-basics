/**
 * This class is used for dealing with the preparation of an explicit Save operation.
 * The following scenarios are covered:
 * - Save, while still validation messages are available -> Save not allowed
 * - Apply, while still validation messages are available -> tbd
 * - Save, while warnings or (non-validation) errors are available -> Depending on configuration the user is asked, whether he wants to proceed
 *
 * Note that in FCL scenarios messages from more than one view might need to be aggregated.
 * It has options to handle the scenario when there is error coming from the backend and we still want to save in second try.
 */

 sap.ui.define(["sap/ui/base/Object", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/base/util/extend"
], function(BaseObject, Filter, FilterOperator, extend) {
	"use strict";

	// A Filter that filters for messages that are at least of severity warning
	var oAtLeastWarningFilter = new Filter({
		filters: [new Filter({
			path: "type",
			operator: FilterOperator.EQ,
			value1: sap.ui.core.MessageType.Warning
			}), new Filter({
			path: "type",
			operator: FilterOperator.EQ,
			value1: sap.ui.core.MessageType.Error
		})],
		and: false
	});
	// A Filter that filters for messages that are of severity error
	var oErrorFilter = new Filter({
		path: "type",
		operator: FilterOperator.EQ,
		value1: sap.ui.core.MessageType.Error
	});

	var sLocalModelName = "model";
	function getMethods(oTemplateContract, oController, oCommonUtils) {

		var fnYes, fnNo; // global functions which should be called when the user either accepts or rejects the operation
		var fnAfterClose; // global function that should be executed when the dialog is closed. Note that actions performed this way are decoupled from the closing operation.
		var oItemBinding; // initialized on demand
		var bShowConfirmationOnDraftActivate = (function(){
			var oComponent = oController.getOwnerComponent();
			var oRegistryEntry = oTemplateContract.componentRegistry[oComponent.getId()];
			return !!(oRegistryEntry.methods.showConfirmationOnDraftActivate && oRegistryEntry.methods.showConfirmationOnDraftActivate());
		})();

		// aControlIds is an array of control ids.
		// The function returns a faulty value if it is not possible to scroll to at least one of the given controls.
		// Otherwise it returns a function that would perform this scrolling.
		function getScrollFunction(aControlIds){
			var aActiveComponents = oTemplateContract.oNavigationControllerProxy.getActiveComponents();
			// Loop over all active detail pages and check whether they are able to scroll to the control
			var fnRet;
			for (var i = 0; i < aActiveComponents.length && !fnRet; i++){
				var sComponentId = aActiveComponents[i];
				var oRegistryEntry = oTemplateContract.componentRegistry[sComponentId];
				fnRet = oRegistryEntry.viewLevel && (oRegistryEntry.methods.getScrollFunction || Function.prototype)(aControlIds);
			}
			return fnRet || null;
		}

		// iSituation: 1: Validations for activate, 2: Validation for Apply, 3: Warnings before activate
		function getConfiguredPopoverIfNeeded(iSituation){
			var oRet, oLocalModel, oMessageView;
			oRet = oCommonUtils.getDialogFragment("sap.suite.ui.generic.template.fragments.MessageInfluencingSave", {
				itemSelected: function(){
					oLocalModel.setProperty("/backbtnvisibility", true);
				},
				onBackButtonPress: function(){
					oMessageView.navigateBack();
					oLocalModel.setProperty("/backbtnvisibility", false);
				},
				onAccept: function(){
					fnAfterClose = fnYes;
					oRet.close();
				},
				onReject: function(){
					fnAfterClose = fnNo;
					oRet.close();
				},
				isPositionable: function(aControlIds){
					return !!(aControlIds && getScrollFunction(aControlIds));
				},
				titlePressed: function(oEvent){ // the user wants to navigate from the message to the corresponding control
					oRet.close();
					var oMessageItem = oEvent.getParameter("item");
					var oMessage = oMessageItem.getBindingContext("msg").getObject();
					fnAfterClose = getScrollFunction(oMessage.controlIds);
					oRet.close();
				},
				afterClose: function(){
					fnYes = null;
					fnNo = null;
					oMessageView.navigateBack();
					(fnAfterClose || Function.prototype)();
					fnAfterClose = null;
				}
			}, sLocalModelName, function(oFragment){
				oMessageView = oFragment.getContent()[0];
				oFragment.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "msg");
				oItemBinding = oFragment.getContent()[0].getBinding("items");
			});
			oLocalModel = oRet.getModel(sLocalModelName);
			oLocalModel.setProperty("/situation", iSituation);
			oLocalModel.setProperty("/backbtnvisibility", false);
			var aFilters = [];
			var aActiveComponents = oTemplateContract.oNavigationControllerProxy.getActiveComponents();
			var bOnlyValidation = (iSituation < 3);
			for (var i = 0; i < aActiveComponents.length; i++){
				var sComponentId = aActiveComponents[i];
				var oRegistryEntry = oTemplateContract.componentRegistry[sComponentId];
				if (oRegistryEntry.oController === oController || iSituation !== 2){
					var aComponentFilters = (oRegistryEntry.methods.getMessageFilters || Function.prototype)(bOnlyValidation);
					aFilters = aComponentFilters ? aFilters.concat(aComponentFilters) : aFilters;
				}
			}
			if (aFilters.length === 0){
				return null;
			}
			var oOverallFilter = aFilters.length === 1 ? aFilters[0] : new Filter({
				 filters: aFilters,
				 and: false
			});
			if (iSituation === 3){
				oErrorFilter = new Filter({
					filters: [oOverallFilter, oErrorFilter],
					and: true
				});
				
				oOverallFilter = new Filter({
					filters: [oOverallFilter, oAtLeastWarningFilter], // make sure that only messages that are at least warnings are shown
					and: true
				});

				if (oItemBinding.filter(oErrorFilter).getLength() === 0) {
					oLocalModel.setProperty("/situation", 4); // 4: no Error
				}
			}

			oItemBinding.filter(oOverallFilter);
			return oItemBinding.getLength() && oRet;
		}

		// Returns a Promise that is resolved, if the operation may be performed and rejected when the operation should be stopped
		// bIsActivation: true: Activate/Save action, false: Apply action
		// oController: the controller that actually has started the operation
		function fnBeforeOperation(bIsActivation){
			var oValidationPopup = getConfiguredPopoverIfNeeded(bIsActivation ? 1 : 2);
			if (oValidationPopup){
				oValidationPopup.open();
				return Promise.reject();
			}
			if (!(bIsActivation && bShowConfirmationOnDraftActivate)){
				return Promise.resolve();
			}
			oValidationPopup = getConfiguredPopoverIfNeeded(3);
			return oValidationPopup ? new Promise(function(fnResolve, fnReject){
				fnYes = fnResolve;
				fnNo = fnReject;
				oValidationPopup.open();
			}) : Promise.resolve();
		}

		// Performs an Activate/Save resp. Apply operation when all prerequisites are given
		function fnPrepareAndRunSaveOperation(bIsActivation, fnOperation){
			oTemplateContract.oApplicationProxy.performAfterSideEffectExecution(function(){
				if (!oTemplateContract.oBusyHelper.isBusy()){
					fnBeforeOperation(bIsActivation).then(fnOperation);
				}
			});
		}

		function fnRestartActivation(fnOperationCallback, fnCancelCallback){
			fnYes = fnOperationCallback;
			fnNo = fnCancelCallback;
			var oWarningDialog = getConfiguredPopoverIfNeeded(3);
			// in case getConfiguredPopoverIfNeeded doesn't filter any suitable warning message for popover
			if (oWarningDialog) {
				oWarningDialog.open();
			} else {
				fnCancelCallback();
			}
		}

		//iScenario = 1 ; Activation
		//iScenario = 2 ; Apply
		//iScenario = 3 ; Save (non Draft)
		//iScenario = 4 ; Restart the operation in case error for activation.
		//Handels the scenario in which save should be performed.
		function fnHandleSaveScenario(iScenario, fnPerformOperation, fnCancel){
			if (iScenario === 4){
				fnRestartActivation(fnPerformOperation, fnCancel);
			} else {
				fnPrepareAndRunSaveOperation((iScenario === 1), fnPerformOperation);
			}
		}

		function hasValidationMessageOnDetailsViews(){
			return !!getConfiguredPopoverIfNeeded(1);
		}

		return {
			handleSaveScenario: fnHandleSaveScenario,
			hasValidationMessageOnDetailsViews: hasValidationMessageOnDetailsViews
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.SaveScenarioHandler", {
		constructor: function(oTemplateContract, oController, oCommonUtils) {
			extend(this, getMethods(oTemplateContract, oController, oCommonUtils));
		}
	});
});
